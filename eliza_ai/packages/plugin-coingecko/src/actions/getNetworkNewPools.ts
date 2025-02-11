import {
    type ActionExample,
    composeContext,
    type Content,
    elizaLogger,
    generateObject,
    type HandlerCallback,
    type IAgentRuntime,
    type Memory,
    ModelClass,
    type State,
    type Action,
} from "@elizaos/core";
import axios from "axios";
import { z } from "zod";
import { getApiConfig, validateCoingeckoConfig } from "../environment";
import { getNetworkNewPoolsTemplate } from "../templates/networkNewPools";
import { getNetworksData } from "../providers/networkProvider";

interface NewPool {
    id: string;
    type: string;
    attributes: {
        name: string;
        market_cap_usd: string;
        fdv_usd: string;
        reserve_in_usd: string;
        pool_created_at: string;
    };
}

interface NewPoolsResponse {
    data: NewPool[];
}

export const GetNetworkNewPoolsSchema = z.object({
    networkId: z.string(),
    limit: z.number().min(1).max(100).default(10),
});

export type GetNetworkNewPoolsContent = z.infer<
    typeof GetNetworkNewPoolsSchema
> &
    Content;

export const isGetNetworkNewPoolsContent = (
    obj: unknown
): obj is GetNetworkNewPoolsContent => {
    return GetNetworkNewPoolsSchema.safeParse(obj).success;
};

export default {
    name: "GET_NETWORK_NEW_POOLS",
    similes: [
        "NETWORK_NEW_POOLS",
        "CHAIN_NEW_POOLS",
        "NEW_POOLS_BY_NETWORK",
        "RECENT_POOLS",
        "LATEST_POOLS",
    ],
    validate: async (runtime: IAgentRuntime, _message: Memory) => {
        await validateCoingeckoConfig(runtime);
        return true;
    },
    description:
        "Get list of newly created pools for a specific network from CoinGecko's onchain data",
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback?: HandlerCallback
    ): Promise<boolean> => {
        elizaLogger.log("Starting CoinGecko GET_NETWORK_NEW_POOLS handler...");

        let currentState = state;
        if (!currentState) {
            currentState = (await runtime.composeState(message)) as State;
        } else {
            currentState = await runtime.updateRecentMessageState(currentState);
        }

        try {
            elizaLogger.log("Composing network new pools context...");
            const newPoolsContext = composeContext({
                state: currentState,
                template: getNetworkNewPoolsTemplate,
            });

            const result = await generateObject({
                runtime,
                context: newPoolsContext,
                modelClass: ModelClass.LARGE,
                schema: GetNetworkNewPoolsSchema,
            });

            if (!isGetNetworkNewPoolsContent(result.object)) {
                elizaLogger.error("Invalid network new pools request format");
                return false;
            }

            // Fetch networks data first
            const networks = await getNetworksData(runtime);

            // Fetch networks data first
            const networksResponse = await getNetworksData(runtime);

            // Find the matching network from the data array
            const network = networksResponse.find((n) => {
                const searchTerm = (
                    result.object as { networkId: string }
                ).networkId.toLowerCase();
                return (
                    n.id.toLowerCase() === searchTerm ||
                    n.attributes.name.toLowerCase().includes(searchTerm) ||
                    n.attributes.coingecko_asset_platform_id.toLowerCase() ===
                        searchTerm
                );
            });

            if (!network) {
                throw new Error(
                    `Network ${result.object.networkId} not found in available networks`
                );
            }

            const config = await validateCoingeckoConfig(runtime);
            const { baseUrl, apiKey, headerKey } = getApiConfig(config);

            elizaLogger.log(
                `Fetching new pools data for network: ${network.id}`
            );

            const response = await axios.get<NewPoolsResponse>(
                `${baseUrl}/onchain/networks/${network.id}/new_pools?include=base_token,dex`,
                {
                    headers: {
                        [headerKey]: apiKey,
                    },
                }
            );

            if (!response.data) {
                throw new Error("No data received from CoinGecko API");
            }

            const formattedData = response.data.data
                .slice(0, result.object.limit)
                .map((pool) => ({
                    name: pool.attributes.name,
                    marketCap: Number(
                        pool.attributes.market_cap_usd
                    ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    }),
                    fdv: Number(pool.attributes.fdv_usd).toLocaleString(
                        "en-US",
                        {
                            style: "currency",
                            currency: "USD",
                        }
                    ),
                    reserveUSD: Number(
                        pool.attributes.reserve_in_usd
                    ).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    }),
                    createdAt: new Date(
                        pool.attributes.pool_created_at
                    ).toLocaleDateString(),
                }));

            const responseText = [
                `New Pools Overview for ${network.attributes.name}:`,
                "",
                ...formattedData.map((pool, index) =>
                    [
                        `${index + 1}. ${pool.name}`,
                        `   Market Cap: ${pool.marketCap}`,
                        `   FDV: ${pool.fdv}`,
                        `   Reserve: ${pool.reserveUSD}`,
                        `   Created: ${pool.createdAt}`,
                        "",
                    ].join("\n")
                ),
            ].join("\n");

            elizaLogger.success(
                "Network new pools data retrieved successfully!"
            );

            if (callback) {
                callback({
                    text: responseText,
                    content: {
                        networkId: network.id,
                        networkName: network.attributes.name,
                        newPools: formattedData,
                        timestamp: new Date().toISOString(),
                    },
                });
            }

            return true;
        } catch (error) {
            elizaLogger.error("Error in GET_NETWORK_NEW_POOLS handler:", error);

            const errorMessage =
                error.response?.status === 429
                    ? "Rate limit exceeded. Please try again later."
                    : `Error fetching new pools data: ${error.message}`;

            if (callback) {
                callback({
                    text: errorMessage,
                    content: {
                        error: error.message,
                        statusCode: error.response?.status,
                    },
                });
            }
            return false;
        }
    },

    examples: [
        [
            {
                user: "{{user1}}",
                content: {
                    text: "Show me new liquidity pools on Ethereum",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll check the new Ethereum liquidity pools for you.",
                    action: "GET_NETWORK_NEW_POOLS",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here are the new pools on ETHEREUM:\n1. PEPE / WETH\n   Market Cap: $954,636,707\n   FDV: $6,402,478,508\n   Reserve: $363,641,037\n   Created: 1/19/2025\n2. SUSHI / WETH\n   Market Cap: $8,844,297,825\n   FDV: $43,874,068,484\n   Reserve: $718,413,745\n   Created: 1/17/2025",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "What are the 5 latest pools on BSC?",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll fetch the 5 latest pools on BSC for you.",
                    action: "GET_NETWORK_NEW_POOLS",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here are the 5 newest pools on BSC:\n1. CAKE / WBNB\n   Market Cap: $954,636,707\n   FDV: $6,402,478,508\n   Reserve: $363,641,037\n   Created: 1/19/2025",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: {
                    text: "List all recent pools on Polygon",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "I'll get all the recently added pools on Polygon for you.",
                    action: "GET_NETWORK_NEW_POOLS",
                },
            },
            {
                user: "{{agent}}",
                content: {
                    text: "Here are all new pools on POLYGON:\n1. MATIC / USDC\n   Market Cap: $954,636,707\n   FDV: $6,402,478,508\n   Reserve: $363,641,037\n   Created: 1/19/2025",
                },
            },
        ],
    ] as ActionExample[][],
} as Action;
