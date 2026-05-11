package project.stock.controller;

import project.stock.model.MouvementStock;
import project.stock.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;
@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    private final StockService stockService;

    @GetMapping
    public List<MouvementStock> getAll() { return stockService.findAll(); }

    @GetMapping("/produit/{id}")
    public List<MouvementStock> getByProduit(@PathVariable Long id) {
        return stockService.findByProduit(id);
    }

    @PostMapping
    public ResponseEntity<MouvementStock> create(@Valid @RequestBody MouvementStock m) {
        return ResponseEntity.status(201).body(stockService.save(m));
    }

    @PutMapping("/{id}")
    public MouvementStock update(@PathVariable Long id, @RequestBody MouvementStock m) {
        return stockService.update(id, m);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        stockService.delete(id);
        return ResponseEntity.noContent().build();
    }
}