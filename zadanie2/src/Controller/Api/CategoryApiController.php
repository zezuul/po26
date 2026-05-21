<?php

namespace App\Controller\Api;

use App\Entity\Category;
use App\Repository\CategoryRepository;
use App\Service\EntitySerializer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/categories')]
class CategoryApiController extends AbstractController
{
    public function __construct(
        private readonly CategoryRepository $repository,
        private readonly EntityManagerInterface $em,
        private readonly EntitySerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_categories_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $data = array_map(
            fn (Category $c) => $this->serializer->categoryToArray($c),
            $this->repository->findAll()
        );

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_categories_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $category = $this->repository->find($id);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializer->categoryToArray($category));
    }

    #[Route('', name: 'api_categories_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $category = new Category();
        if (isset($data['name'])) {
            $category->setName((string) $data['name']);
        }
        if (array_key_exists('description', $data)) {
            $category->setDescription($data['description']);
        }

        $this->em->persist($category);
        $this->em->flush();

        return $this->json($this->serializer->categoryToArray($category), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_categories_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $category = $this->repository->find($id);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        if (isset($data['name'])) {
            $category->setName((string) $data['name']);
        }
        if (array_key_exists('description', $data)) {
            $category->setDescription($data['description']);
        }

        $this->em->flush();

        return $this->json($this->serializer->categoryToArray($category));
    }

    #[Route('/{id}', name: 'api_categories_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $category = $this->repository->find($id);
        if (!$category) {
            return $this->json(['error' => 'Category not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($category);
        $this->em->flush();

        return $this->json(['message' => 'Category deleted']);
    }
}
