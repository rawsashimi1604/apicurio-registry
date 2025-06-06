import { AuthService, useAuth } from "@apicurio/common-ui-components";
import { ConfigService, useConfigService } from "@services/useConfigService.ts";
import { createAuthOptions, createEndpoint, getRegistryClient, httpPost } from "@utils/rest.utils.ts";
import { Paging } from "@models/paging.model.ts";
import {
    ArtifactTypeInfo, ConfigurationProperty,
    CreateRule, DownloadRef,
    RoleMapping,
    RoleMappingSearchResults,
    RoleType,
    Rule,
    RuleType, UpdateConfigurationProperty,
    type UpdateRole
} from "@sdk/lib/generated-client/models";


const getArtifactTypes = async (config: ConfigService, auth: AuthService): Promise<ArtifactTypeInfo[]> => {
    console.info("[AdminService] Getting the global list of artifactTypes.");
    return await getRegistryClient(config, auth).admin.config.artifactTypes.get().then(v => v!);
};

const getRules = async (config: ConfigService, auth: AuthService): Promise<Rule[]> => {
    console.info("[AdminService] Getting the global list of rules.");
    const ruleTypes = (await getRegistryClient(config, auth).admin.rules.get()) as RuleType[];
    return Promise.all(
        ruleTypes.map(rt => getRule(config, auth, rt))
    );
};

const getRule = async (config: ConfigService, auth: AuthService, type: string): Promise<Rule> => {
    return await getRegistryClient(config, auth).admin.rules.byRuleType(type).get() as Promise<Rule>;
};

const createRule = async (config: ConfigService, auth: AuthService, ruleType: string, configValue: string): Promise<Rule> => {
    console.info("[AdminService] Creating global rule:", ruleType);
    const body: CreateRule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).admin.rules.post(body).then(() => body);
};

const updateRule = async (config: ConfigService, auth: AuthService, ruleType: string, configValue: string): Promise<Rule|null> => {
    console.info("[AdminService] Updating global rule:", ruleType);
    const rule: Rule = {
        config: configValue,
        ruleType: ruleType as RuleType
    };
    return getRegistryClient(config, auth).admin.rules.byRuleType(ruleType).put(rule).then(v => v!);
};

const deleteRule = async (config: ConfigService, auth: AuthService, ruleType: string): Promise<null> => {
    console.info("[AdminService] Deleting global rule:", ruleType);

    return getRegistryClient(config, auth).admin.rules.byRuleType(ruleType).delete().then(() => null);
};

const getRoleMappings = async (config: ConfigService, auth: AuthService, paging: Paging): Promise<RoleMappingSearchResults> => {
    console.info("[AdminService] Getting the list of role mappings.");
    const start: number = (paging.page - 1) * paging.pageSize;
    const end: number = start + paging.pageSize;
    return getRegistryClient(config, auth).admin.roleMappings.get({
        queryParameters: {
            limit: end,
            offset: start
        }
    }).then(v => v!);
};

const getRoleMapping = async (config: ConfigService, auth: AuthService, principalId: string): Promise<RoleMapping> => {
    return getRegistryClient(config, auth).admin.roleMappings.byPrincipalId(principalId).get().then(v => v!);
};

const createRoleMapping = async (config: ConfigService, auth: AuthService, principalId: string, role: string, principalName: string): Promise<RoleMapping> => {
    console.info("[AdminService] Creating a role mapping:", principalId, role, principalName);
    const body: RoleMapping = {
        principalId,
        role: role as RoleType,
        principalName
    };
    return getRegistryClient(config, auth).admin.roleMappings.post(body).then(() => {
        return {
            principalId: principalId,
            role: role as RoleType,
            principalName: principalName
        };
    });
};

const updateRoleMapping = async (config: ConfigService, auth: AuthService, principalId: string, role: string): Promise<RoleMapping> => {
    console.info("[AdminService] Updating role mapping:", principalId, role);
    const body: UpdateRole = {
        role: role as RoleType
    };
    return getRegistryClient(config, auth).admin.roleMappings.byPrincipalId(principalId).put(body).then(() => {
        return {
            principalId: principalId,
            role: role as RoleType
        };
    });
};

const deleteRoleMapping = async (config: ConfigService, auth: AuthService, principalId: string): Promise<null> => {
    console.info("[AdminService] Deleting role mapping for:", principalId);
    return getRegistryClient(config, auth).admin.roleMappings.byPrincipalId(principalId).delete().then(() => null);
};

const exportAs = async (config: ConfigService, auth: AuthService, filename: string): Promise<DownloadRef> => {
    const baseHref: string = config.artifactsUrl();
    return getRegistryClient(config, auth).admin.exportEscaped.get({
        headers: {
            "Accept": "application/zip"
        },
        queryParameters: {
            forBrowser: true
        }
    }).then(ref => {
        if (ref?.href?.startsWith("/apis/registry/v2")) {
            ref.href = ref.href.replace("/apis/registry/v2", baseHref);
            ref.href = ref.href + "/" + filename;
        } else if (ref?.href?.startsWith("/apis/registry/v3")) {
            ref.href = ref.href.replace("/apis/registry/v3", baseHref);
            ref.href = ref.href + "/" + filename;
        }
        return ref!;
    });
};

// TODO convert to using the SDK?
const importFrom = async (config: ConfigService, auth: AuthService, file: string | File, progressFunction: (progressEvent: any) => void): Promise<void> => {
    const baseHref: string = config.artifactsUrl();
    const options = await createAuthOptions(auth);
    options.headers = {
        ...options.headers,
        "Content-Type": "application/zip"
    };
    const endpoint: string = createEndpoint(baseHref, "/admin/import");
    return httpPost(endpoint, file, options,undefined, progressFunction);
};

const listConfigurationProperties = async (config: ConfigService, auth: AuthService): Promise<ConfigurationProperty[]> => {
    console.info("[AdminService] Getting the dynamic config properties.");
    return getRegistryClient(config, auth).admin.config.properties.get().then(v => v!);
};

const setConfigurationProperty = async (config: ConfigService, auth: AuthService, propertyName: string, newValue: string): Promise<void> => {
    console.info("[AdminService] Setting a config property: ", propertyName);
    const body: UpdateConfigurationProperty = {
        value: newValue
    };
    return getRegistryClient(config, auth).admin.config.properties.byPropertyName(propertyName).put(body);
};

const resetConfigurationProperty = async (config: ConfigService, auth: AuthService, propertyName: string): Promise<void> => {
    console.info("[AdminService] Resetting a config property: ", propertyName);
    return getRegistryClient(config, auth).admin.config.properties.byPropertyName(propertyName).delete();
};


export interface AdminService {
    getArtifactTypes(): Promise<ArtifactTypeInfo[]>;
    getRules(): Promise<Rule[]>;
    getRule(ruleType: string): Promise<Rule>;
    createRule(ruleType: string, config: string): Promise<Rule>;
    updateRule(ruleType: string, config: string): Promise<Rule|null>;
    deleteRule(ruleType: string): Promise<null>;
    getRoleMappings(paging: Paging): Promise<RoleMappingSearchResults>;
    getRoleMapping(principalId: string): Promise<RoleMapping>;
    createRoleMapping(principalId: string, role: string, principalName: string): Promise<RoleMapping>;
    updateRoleMapping(principalId: string, role: string): Promise<RoleMapping>;
    deleteRoleMapping(principalId: string): Promise<null>;
    exportAs(filename: string): Promise<DownloadRef>;
    importFrom(file: string | File, progressFunction: (progressEvent: any) => void): Promise<void>;
    listConfigurationProperties(): Promise<ConfigurationProperty[]>;
    setConfigurationProperty(propertyName: string, newValue: string): Promise<void>;
    resetConfigurationProperty(propertyName: string): Promise<void>;
}


export const useAdminService: () => AdminService = (): AdminService => {
    const config: ConfigService = useConfigService();
    const auth: AuthService = useAuth();

    return {
        getArtifactTypes(): Promise<ArtifactTypeInfo[]> {
            return getArtifactTypes(config, auth);
        },
        getRules(): Promise<Rule[]> {
            return getRules(config, auth);
        },
        getRule(ruleType: string): Promise<Rule> {
            return getRule(config, auth, ruleType);
        },
        createRule(ruleType: string, configValue: string): Promise<Rule> {
            return createRule(config, auth, ruleType, configValue);
        },
        updateRule(ruleType: string, configValue: string): Promise<Rule|null> {
            return updateRule(config, auth, ruleType, configValue);
        },
        deleteRule(ruleType: string): Promise<null> {
            return deleteRule(config, auth, ruleType);
        },
        getRoleMappings(paging: Paging): Promise<RoleMappingSearchResults> {
            return getRoleMappings(config, auth, paging);
        },
        getRoleMapping(principalId: string): Promise<RoleMapping> {
            return getRoleMapping(config, auth, principalId);
        },
        createRoleMapping(principalId: string, role: string, principalName: string): Promise<RoleMapping> {
            return createRoleMapping(config, auth, principalId, role, principalName);
        },
        updateRoleMapping(principalId: string, role: string): Promise<RoleMapping> {
            return updateRoleMapping(config, auth, principalId, role);
        },
        deleteRoleMapping(principalId: string): Promise<null> {
            return deleteRoleMapping(config, auth, principalId);
        },
        exportAs(filename: string): Promise<DownloadRef> {
            return exportAs(config, auth, filename);
        },
        importFrom(file: string | File, progressFunction: (progressEvent: any) => void): Promise<void> {
            return importFrom(config, auth, file, progressFunction);
        },
        listConfigurationProperties(): Promise<ConfigurationProperty[]> {
            return listConfigurationProperties(config, auth);
        },
        setConfigurationProperty(propertyName: string, newValue: string): Promise<void> {
            return setConfigurationProperty(config, auth, propertyName, newValue);
        },
        resetConfigurationProperty(propertyName: string): Promise<void> {
            return resetConfigurationProperty(config, auth, propertyName);
        }
    };
};
