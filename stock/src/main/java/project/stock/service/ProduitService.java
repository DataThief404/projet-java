package project.stock.service;

import project.stock.model.Produit;
import project.stock.model.Categorie;
import project.stock.repository.ProduitRepository;
import project.stock.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class ProduitService {

    private final ProduitRepository produitRepository;
    private final CategorieRepository categorieRepository;

    public List<Produit> findAll() { return produitRepository.findAll(); }

    public Produit findById(Long id) {
        return produitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit introuvable"));
    }

    public List<Produit> search(String nom) {
        return produitRepository.findByNomContainingIgnoreCase(nom);
    }

    public List<Produit> getLowStock(Integer seuil) {
        return produitRepository.findByQuantiteStockLessThan(seuil);
    }

    public Produit save(Produit produit) {
        return produitRepository.save(produit);
    }

    public Produit update(Long id, Produit updated) {
        Produit existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setDescription(updated.getDescription());
        existing.setPrix(updated.getPrix());
        existing.setCategorie(updated.getCategorie());
        return produitRepository.save(existing);
    }

    public void delete(Long id) { produitRepository.deleteById(id); }

    // called by StockService after each movement
    public void updateQuantite(Long produitId, int delta) {
        Produit p = findById(produitId);
        int newQty = p.getQuantiteStock() + delta;
        if (newQty < 0) throw new RuntimeException("Stock insuffisant");
        p.setQuantiteStock(newQty);
        produitRepository.save(p);
    }
}