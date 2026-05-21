<?php

namespace App\Service;

use App\Entity\Category;
use App\Entity\Customer;
use App\Entity\Product;

class EntitySerializer
{
    public function productToArray(Product $product): array
    {
        return [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
            'price' => $product->getPrice(),
            'stock' => $product->getStock(),
            'category_id' => $product->getCategory()?->getId(),
        ];
    }

    public function categoryToArray(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'description' => $category->getDescription(),
        ];
    }

    public function customerToArray(Customer $customer): array
    {
        return [
            'id' => $customer->getId(),
            'name' => $customer->getName(),
            'email' => $customer->getEmail(),
            'phone' => $customer->getPhone(),
            'address' => $customer->getAddress(),
        ];
    }
}
