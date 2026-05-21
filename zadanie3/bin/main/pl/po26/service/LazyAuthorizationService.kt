package pl.po26.service

import org.springframework.context.annotation.Profile
import org.springframework.stereotype.Service
import pl.po26.singleton.LazyAuthSingleton

@Service
@Profile("lazy")
class LazyAuthorizationService : AuthorizationService {

    override fun authorize(username: String, password: String): Boolean =
        LazyAuthSingleton.instance.authorize(username, password)

    override fun singletonMode(): String = "lazy"

    override fun singletonInstanceId(): String = LazyAuthSingleton.instance.instanceId()
}
