// Auto-generated from appwrite.json - DO NOT EDIT MANUALLY
// Run 'yarn appwrite:config' to regenerate this file

// Appwrite configuration object (converted from appwrite.json)
const appwriteConfig = {
    projectId: "jaweeb",
    projectName: "Jaweeb",
    settings: {
        services: {
            account: true,
            avatars: true,
            databases: true,
            locale: true,
            health: true,
            storage: true,
            teams: true,
            users: true,
            functions: true,
            graphql: true,
            messaging: true
        },
        auth: {
            methods: {
                jwt: true,
                phone: true,
                invites: true,
                anonymous: true,
                emailOtp: true,
                magicUrl: true,
                emailPassword: true
            },
            security: {
                duration: 31536000,
                limit: 0,
                sessionsLimit: 10,
                passwordHistory: 0,
                passwordDictionary: false,
                personalDataCheck: false,
                sessionAlerts: false,
                mockNumbers: []
            }
        }
    },
    functions: [
        {
            $id: "image-generator",
            execute: [
                "any"
            ],
            name: "image-generator",
            enabled: true,
            logging: true,
            runtime: "node-16.0",
            scopes: [
                "users.read",
                "files.read",
                "files.write",
                "buckets.read",
                "buckets.write"
            ],
            events: [],
            schedule: "",
            timeout: 15,
            entrypoint: "src/main.js",
            commands: "npm install",
            specification: "s-0.5vcpu-512mb",
            path: "functions/image-generator"
        }
    ],
    databases: [
        {
            $id: "jaweeb",
            name: "jaweeb",
            enabled: true
        }
    ],
    collections: [
        {
            $id: "categories",
            $permissions: [
                "read(\"guests\")"
            ],
            databaseId: "jaweeb",
            name: "Category",
            enabled: true,
            documentSecurity: false,
            attributes: [
                {
                    key: "title",
                    type: "string",
                    required: true,
                    array: false,
                    size: 50,
                    default: null,
                    encrypt: false
                },
                {
                    key: "enabled",
                    type: "boolean",
                    required: false,
                    array: false,
                    default: true
                },
                {
                    key: "templates",
                    type: "relationship",
                    required: false,
                    array: false,
                    relatedCollection: "templates",
                    relationType: "oneToMany",
                    twoWay: true,
                    twoWayKey: "category",
                    onDelete: "setNull",
                    side: "parent"
                },
                {
                    key: "icon",
                    type: "string",
                    required: false,
                    array: false,
                    size: 20,
                    default: null,
                    encrypt: false
                }
            ],
            indexes: []
        },
        {
            $id: "templates",
            $permissions: [
                "read(\"guests\")"
            ],
        //     databaseId: "jaweeb",
        //     name: "Template",
        //     enabled: true,
        //     documentSecurity: false,
        //     attributes: [
        //         {
        //             key: "category",
        //             type: "relationship",
        //             required: false,
        //             array: false,
        //             relatedCollection: "categories",
        //             relationType: "oneToMany",
        //             twoWay: true,
        //             twoWayKey: "templates",
        //             onDelete: "setNull",
        //             side: "child"
        //         },
        //         {
        //             key: "title",
        //             type: "string",
        //             required: false,
        //             array: false,
        //             size: 50,
        //             default: null,
        //             encrypt: false
        //         },
        //         {
        //             key: "prompt",
        //             type: "string",
        //             required: true,
        //             array: false,
        //             size: 1000,
        //             default: null,
        //             encrypt: false
        //         },
        //         {
        //             key: "previewFileId",
        //             type: "string",
        //             required: false,
        //             array: false,
        //             size: 20,
        //             default: null,
        //             encrypt: false
        //         }
        //     ],
        //     indexes: []
        }
    ]
} as const;

// Auto-generated types from appwrite config
export type AppwriteConfig = typeof appwriteConfig;

// Export the configuration directly
export const APPWRITE_CONFIG: AppwriteConfig = appwriteConfig;
