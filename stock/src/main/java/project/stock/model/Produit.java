package project.stock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data @NoArgsConstructor
public class Produit {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    private String description;
    private Double prix;

    @Column(nullable = false)
    private Integer quantiteStock = 0; // updated on every mouvement

    @ManyToOne
    @JoinColumn(name = "categorie_id")
    private Categorie categorie;
}