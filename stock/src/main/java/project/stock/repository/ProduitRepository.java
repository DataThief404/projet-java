package project.stock.repository;

import project.stock.model.Produit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProduitRepository extends JpaRepository<Produit, Long> {
    List<Produit> findByCategorieId(Long categorieId);
    List<Produit> findByNomContainingIgnoreCase(String nom); // search
    List<Produit> findByQuantiteStockLessThan(Integer seuil); // low stock alert
}