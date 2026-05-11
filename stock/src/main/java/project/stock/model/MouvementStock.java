package project.stock.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
@Entity
@Data
@NoArgsConstructor
public class MouvementStock {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TypeMouvement type; // ENTREE or SORTIE

    @Column(nullable = false)
    private Integer quantite;

    private String motif;

    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User createdBy; // who made the movement
}