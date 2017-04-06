package com.example;

import com.netflix.hystrix.contrib.javanica.annotation.HystrixCommand;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.circuitbreaker.EnableCircuitBreaker;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
import org.springframework.cloud.netflix.feign.FeignClient;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.Resources;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@SpringBootApplication
@EnableDiscoveryClient
@EnableCircuitBreaker
@EnableFeignClients
@EnableZuulProxy
public class PwaEdgeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PwaEdgeServiceApplication.class, args);
	}
}

@FeignClient("beers-catalog-service")
interface CraftBeerClient {

	@RequestMapping(method = RequestMethod.GET, value = "/beers")
	Resources<Resource<Beer>> read();
}

@RestController
class CraftBeerApiAdapter {
	private CraftBeerClient client;

	public CraftBeerApiAdapter(CraftBeerClient client) {
		this.client = client;
	}

	@GetMapping("/good-beers")
	@HystrixCommand(fallbackMethod = "goodBeersFallback")
    @CrossOrigin(origins = "*")
	public Collection<Map<String, String>> goodBeers() {

		return this.client.read()
				.getContent()
				.stream()
				.filter(c -> !c.getContent().getName().equals("Budweiser"))
				.map(c -> {
							Map<String, String> m = new HashMap<String, String>();
							m.put("name", c.getContent().getName());
							m.put("imageUrl", c.getLink("self").getHref() + ".png");
							return m;
						}
				).collect(Collectors.toList());
	}


	public Collection<Map<String, String>> goodBeersFallback() {
		return new ArrayList<>();
	}
}

class Beer {
	private String name;
	private String imageUrl;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
