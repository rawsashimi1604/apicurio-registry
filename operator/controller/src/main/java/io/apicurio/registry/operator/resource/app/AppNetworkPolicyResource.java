package io.apicurio.registry.operator.resource.app;

import io.apicurio.registry.operator.api.v1.ApicurioRegistry3;
import io.apicurio.registry.operator.resource.LabelDiscriminators.AppNetworkPolicyDiscriminator;
import io.fabric8.kubernetes.api.model.networking.v1.NetworkPolicy;
import io.javaoperatorsdk.operator.api.reconciler.Context;
import io.javaoperatorsdk.operator.processing.dependent.kubernetes.CRUDKubernetesDependentResource;
import io.javaoperatorsdk.operator.processing.dependent.kubernetes.KubernetesDependent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static io.apicurio.registry.operator.resource.ResourceFactory.COMPONENT_APP;
import static io.apicurio.registry.operator.resource.ResourceKey.APP_NETWORK_POLICY_KEY;
import static io.apicurio.registry.operator.utils.Mapper.toYAML;

// spotless:off
@KubernetesDependent(
        labelSelector = "app.kubernetes.io/name=apicurio-registry,app.kubernetes.io/component=" + COMPONENT_APP,
        resourceDiscriminator = AppNetworkPolicyDiscriminator.class
)
// spotless:on
public class AppNetworkPolicyResource
        extends CRUDKubernetesDependentResource<NetworkPolicy, ApicurioRegistry3> {

    private static final Logger log = LoggerFactory.getLogger(AppNetworkPolicyResource.class);

    public AppNetworkPolicyResource() {
        super(NetworkPolicy.class);
    }

    @Override
    protected NetworkPolicy desired(ApicurioRegistry3 primary, Context<ApicurioRegistry3> context) {
        var networkPolicy = APP_NETWORK_POLICY_KEY.getFactory().apply(primary);
        log.debug("Desired {} is {}", APP_NETWORK_POLICY_KEY.getId(), toYAML(networkPolicy));
        return networkPolicy;
    }
}
