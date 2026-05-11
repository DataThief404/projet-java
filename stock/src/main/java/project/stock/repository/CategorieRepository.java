package project.stock.repository;

import project.stock.model.Categorie;
import org.springframework.data.jpa.repository.JpaRepository;
public interface CategorieRepository extends JpaRepository<Categorie, Long> {
    boolean existsByNom(String nom);
}