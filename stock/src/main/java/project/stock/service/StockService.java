package project.stock.service;

import project.stock.model.MouvementStock;
import project.stock.model.TypeMouvement;
import project.stock.repository.MouvementStockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.time.LocalDateTime;
@Service
@RequiredArgsConstructor
public class StockService {

    private final MouvementStockRepository stockRepository;
    private final ProduitService produitService;

    public List<MouvementStock> findAll() {
        return stockRepository.findAllByOrderByDateDesc();
    }

    public List<MouvementStock> findByProduit(Long produitId) {
        return stockRepository.findByProduitId(produitId);
    }

    public MouvementStock save(MouvementStock mouvement) {
        // automatically update product quantity
        int delta = mouvement.getType() == TypeMouvement.ENTREE
                ? mouvement.getQuantite()
                : -mouvement.getQuantite();

        produitService.updateQuantite(mouvement.getProduit().getId(), delta);
        mouvement.setDate(LocalDateTime.now());
        return stockRepository.save(mouvement);
    }

    public MouvementStock update(Long id, MouvementStock updated) {
        MouvementStock existing = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement introuvable"));

        // reverse old movement, apply new one
        int oldDelta = existing.getType() == TypeMouvement.ENTREE
                ? -existing.getQuantite() : existing.getQuantite();
        int newDelta = updated.getType() == TypeMouvement.ENTREE
                ? updated.getQuantite() : -updated.getQuantite();

        produitService.updateQuantite(existing.getProduit().getId(), oldDelta + newDelta);

        existing.setQuantite(updated.getQuantite());
        existing.setType(updated.getType());
        existing.setMotif(updated.getMotif());
        return stockRepository.save(existing);
    }

    public void delete(Long id) {
        MouvementStock m = stockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Mouvement introuvable"));

        // reverse the movement before deleting
        int delta = m.getType() == TypeMouvement.ENTREE
                ? -m.getQuantite() : m.getQuantite();
        produitService.updateQuantite(m.getProduit().getId(), delta);

        stockRepository.deleteById(id);
    }
}