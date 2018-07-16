package io.zensoft.share.listener.facebook;

import io.zensoft.share.config.rabbitmq.RabbitMqComponentDeclarationConfiguration;
import io.zensoft.share.dto.VacancyDto;
import io.zensoft.share.listener.VacancyListener;
import io.zensoft.share.service.PublisherManagerService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

@Controller
public class FacebookListener implements VacancyListener {

    private final PublisherManagerService facebookPublisherManagerService;

    @Autowired
    public FacebookListener(PublisherManagerService facebookPublisherManagerService){
        this.facebookPublisherManagerService = facebookPublisherManagerService;
    }

    @Override
    @RabbitListener(queues = RabbitMqComponentDeclarationConfiguration.QUEUE_FACEBOOK_PUBLISH)
    public void publish(VacancyDto vacancyDto) {
        facebookPublisherManagerService.publish(vacancyDto);
    }

    @Override
    @RabbitListener(queues = RabbitMqComponentDeclarationConfiguration.QUEUE_FACEBOOK_GET_INFO)
    public void getInfo(VacancyDto vacancyDto) {
        facebookPublisherManagerService.getInfo(vacancyDto);
    }
}
