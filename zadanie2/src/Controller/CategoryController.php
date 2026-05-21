<?php

namespace App\Controller;

use App\Entity\Category;
use App\Form\CategoryType;
use App\Repository\CategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/categories')]
class CategoryController extends AbstractController
{
    public function __construct(
        private readonly CategoryRepository $repository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[Route('', name: 'categories_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('category/index.html.twig', [
            'categories' => $this->repository->findAll(),
        ]);
    }

    #[Route('/new', name: 'categories_new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $category = new Category();
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($category);
            $this->em->flush();
            $this->addFlash('success', 'Kategoria została dodana.');

            return $this->redirectToRoute('categories_index');
        }

        return $this->render('category/new.html.twig', [
            'category' => $category,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'categories_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Category $category): Response
    {
        return $this->render('category/show.html.twig', ['category' => $category]);
    }

    #[Route('/{id}/edit', name: 'categories_edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Category $category): Response
    {
        $form = $this->createForm(CategoryType::class, $category);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Kategoria została zaktualizowana.');

            return $this->redirectToRoute('categories_show', ['id' => $category->getId()]);
        }

        return $this->render('category/edit.html.twig', [
            'category' => $category,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'categories_delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Category $category): Response
    {
        if ($this->isCsrfTokenValid('delete'.$category->getId(), $request->request->get('_token'))) {
            $this->em->remove($category);
            $this->em->flush();
            $this->addFlash('success', 'Kategoria została usunięta.');
        }

        return $this->redirectToRoute('categories_index');
    }
}
