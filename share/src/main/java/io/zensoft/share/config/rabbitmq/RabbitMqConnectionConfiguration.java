package io.zensoft.share.config.rabbitmq;

import org.springframework.amqp.core.AmqpAdmin;
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitAdmin;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

/**
 * Created by temirlan on 6/27/18.
 */
@Configuration
@ComponentScan
public class RabbitMqConnectionConfiguration {

    @Value("${rabbitmq.host}")
    private String rabbitMqHost;
    @Value("${rabbitmq.username}")
    private String rabbitMqUsername;
    @Value("${rabbitmq.password}")
    private String rabbitMqPassword;

    /*
    * in future will be injected connection needed credentials
    * temporary it runs in a localhost
    */
    @Bean
    public ConnectionFactory rabbitMqConnectionFactory() {
        CachingConnectionFactory connectionFactory =
                new CachingConnectionFactory();
        connectionFactory.setPassword(rabbitMqPassword);
        connectionFactory.setUsername(rabbitMqUsername);
        connectionFactory.setHost(rabbitMqHost);
        return connectionFactory;
    }

    @Bean
    public AmqpAdmin amqpAdmin(ConnectionFactory connectionFactory) {
        RabbitAdmin rabbitAdmin = new RabbitAdmin(connectionFactory);
        return rabbitAdmin;
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter jsonMessageConverter) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(jsonMessageConverter);
        return rabbitTemplate;
    }
  
}
