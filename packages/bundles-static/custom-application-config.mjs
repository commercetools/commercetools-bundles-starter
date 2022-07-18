import { entryPointUriPath, PERMISSIONS } from "./src/constants";

const config = {
    name: "Static bundles",
    entryPointUriPath: entryPointUriPath,
    cloudIdentifier: "gcp-us",
    env: {
        production: {
            applicationId: "",
            url: "",
        },
        development: {
            initialProjectKey: ""
        }
    },
    additionalEnv: {
        mcURL:"mc.us-central1.gcp.commercetools.com"
    },
    mainMenuLink: {
        key: "Bundles",
        uriPath: "bundle-manager",
        icon: "RocketIcon",
        permissions: [PERMISSIONS.View, PERMISSIONS.Manage],
        featureToggle: null,
        submenu: [],
        labelAllLocales: [
            {
                locale: "en",
                value: "Bundles"
            },
            {
                locale: "de",
                value: "Bundles"
            },
            {
                locale: "es",
                value: "Bundles"
            }
        ]
    }
}

export default config
