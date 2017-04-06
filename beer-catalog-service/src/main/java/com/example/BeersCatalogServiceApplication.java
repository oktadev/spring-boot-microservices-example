package com.example;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.security.Principal;
import java.util.stream.Stream;

@SpringBootApplication
@EnableDiscoveryClient
public class BeersCatalogServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(BeersCatalogServiceApplication.class, args);
    }
}

@Entity
class Beer {

    private String name;
    @GeneratedValue
    @Id
    private Long id;

    public Beer() {
    }

    public Beer(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

@RepositoryRestResource
interface BeerRepository extends JpaRepository<Beer, Long> {}

@Component
class BlogCommandLineRunner implements CommandLineRunner {

    public BlogCommandLineRunner(BeerRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) throws Exception {
        Stream.of("Kronenbourg", "Budweiser", "Leffe", "Rochefort",
                "Heineken", "Duvel", "Brooklyn Lager", "Karmeliet").forEach(x ->
            repository.save(new Beer(x))
        );
        repository.findAll().forEach(System.out::println);
    }

    private final BeerRepository repository;
}

@RestController
class BeerController {

    @RequestMapping("/foo")
    void list(Principal principal) {
        System.out.print(principal);
    }
}
