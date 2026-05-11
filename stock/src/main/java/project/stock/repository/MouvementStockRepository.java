package project.stock.repository;

import project.stock.model.MouvementStock;
import project.stock.model.TypeMouvement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MouvementStockRepository extends JpaRepository<MouvementStock, Long> {
    List<MouvementStock> findByProduitId(Long produitId);
    List<MouvementStock> findByType(TypeMouvement type);
    List<MouvementStock> findByCreatedByIdOrderByDateDesc(Long userId);
    List<MouvementStock> findAllByOrderByDateDesc();
}