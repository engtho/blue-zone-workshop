package workshop.ticketservice.controller

import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping

@Controller
class OpenApiController {
    @RequestMapping("/")
    fun index(): String {
        return "redirect:swagger-ui.html"
    }
}