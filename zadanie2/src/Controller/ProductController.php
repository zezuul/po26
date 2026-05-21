<?php

namespace App\Controller;

use App\Entity\Product;
use App\Form\ProductType;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    public function __construct(
        private readonly ProductRepository $repository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[Route('', name: 'products_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $this->repository->findAll(),
        ]);
    }

    #[Route('/new', name: 'products_new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $product = new Product();
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($product);
            $this->em->flush();
            $this->addFlash('success', 'Produkt został dodany.');

            return $this->redirectToRoute('products_index');
        }

        return $this->render('product/new.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'products_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', ['product' => $product]);
    }

    #[Route('/{id}/edit', name: 'products_edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Product $product): Response
    {
        $form = $this->createForm(ProductType::class, $product);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Produkt został zaktualizowany.');

            return $this->redirectToRoute('products_show', ['id' => $product->getId()]);
        }

        return $this->render('product/edit.html.twig', [
            'product' => $product,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'products_delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Product $product): Response
    {
        if ($this->isCsrfTokenValid('delete'.$product->getId(), $request->request->get('_token'))) {
            $this->em->remove($product);
            $this->em->flush();
            $this->addFlash('success', 'Produkt został usunięty.');
        }

        return $this->redirectToRoute('products_index');
    }
}
