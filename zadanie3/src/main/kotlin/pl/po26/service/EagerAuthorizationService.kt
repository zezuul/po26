package pl.po26.service

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import pl.po26.singleton.EagerAuthSingleton

@Service
@Profile("eager")
class EagerAuthorizationService : AuthorizationService {

    override fun authorize(username: String, password: String): Boolean =
        EagerAuthSingleton.authorize(username, password)

    override fun singletonMode(): String = "eager"

    override fun singletonInstanceId(): String = EagerAuthSingleton.instanceId()
}
