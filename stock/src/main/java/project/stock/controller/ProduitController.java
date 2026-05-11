package project.stock.controller;

import project.stock.model.Produit;
import project.stock.service.ProduitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/produits")
@RequiredArgsConstructor
public class ProduitController {

    private final ProduitService produitService;

    @GetMapping
    public List<Produit> getAll() { return produitService.findAll(); }

    @GetMapping("/{id}")
    public Produit getById(@PathVariable Long id) { return produitService.findById(id); }

    @GetMapping("/search")
    public List<Produit> search(@RequestParam String nom) { return produitService.search(nom); }

    @GetMapping("/low-stock")
    public List<Produit> lowStock(@RequestParam(defaultValue = "5") Integer seuil) {
        return produitService.getLowStock(seuil);
    }

    @PostMapping
    public ResponseEntity<Produit> create(@Valid @RequestBody Produit p) {
        return ResponseEntity.status(201).body(produitService.save(p));
    }

    @PutMapping("/{id}")
    public Produit update(@PathVariable Long id, @RequestBody Produit p) {
        return produitService.update(id, p);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produitService.delete(id);
        return ResponseEntity.noContent().build();
    }
}