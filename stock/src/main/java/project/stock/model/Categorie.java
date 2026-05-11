package project.stock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;
@Entity
@Data @NoArgsConstructor
public class Categorie {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nom;

    private String description;

    @OneToMany(mappedBy = "categorie", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Produit> produits;
}