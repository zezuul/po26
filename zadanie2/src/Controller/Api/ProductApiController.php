<?php

namespace App\Controller\Api;

use App\Entity\Product;
use App\Repository\CategoryRepository;
use App\Repository\ProductRepository;
use App\Service\EntitySerializer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products')]
class ProductApiController extends AbstractController
{
    public function __construct(
        private readonly ProductRepository $repository,
        private readonly CategoryRepository $categoryRepository,
        private readonly EntityManagerInterface $em,
        private readonly EntitySerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_products_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $data = array_map(
            fn (Product $p) => $this->serializer->productToArray($p),
            $this->repository->findAll()
        );

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_products_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $product = $this->repository->find($id);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializer->productToArray($product));
    }

    #[Route('', name: 'api_products_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $product = $this->fillFromArray(new Product(), $data);
        $this->em->persist($product);
        $this->em->flush();

        return $this->json($this->serializer->productToArray($product), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_products_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $product = $this->repository->find($id);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $this->fillFromArray($product, $data);
        $this->em->flush();

        return $this->json($this->serializer->productToArray($product));
    }

    #[Route('/{id}', name: 'api_products_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $product = $this->repository->find($id);
        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($product);
        $this->em->flush();

        return $this->json(['message' => 'Product deleted']);
    }

    private function fillFromArray(Product $product, array $data): Product
    {
        if (isset($data['name'])) {
            $product->setName((string) $data['name']);
        }
        if (array_key_exists('description', $data)) {
            $product->setDescription($data['description']);
        }
        if (isset($data['price'])) {
            $product->setPrice((float) $data['price']);
        }
        if (isset($data['stock'])) {
            $product->setStock((int) $data['stock']);
        }
        if (array_key_exists('category_id', $data)) {
            $category = null;
            if ($data['category_id'] !== null) {
                $category = $this->categoryRepository->find((int) $data['category_id']);
            }
            $product->setCategory($category);
        }

        return $product;
    }
}
