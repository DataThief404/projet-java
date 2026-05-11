package project.stock.service;

import project.stock.model.Categorie;
import project.stock.repository.CategorieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class CategorieService {

    private final CategorieRepository categorieRepository;

    public List<Categorie> findAll() { return categorieRepository.findAll(); }

    public Categorie save(Categorie c) {
        if (categorieRepository.existsByNom(c.getNom()))
            throw new RuntimeException("Catégorie déjà existante");
        return categorieRepository.save(c);
    }

    public void delete(Long id) { categorieRepository.deleteById(id); }
}
