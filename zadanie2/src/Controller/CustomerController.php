<?php

namespace App\Controller;

use App\Entity\Customer;
use App\Form\CustomerType;
use App\Repository\CustomerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/customers')]
class CustomerController extends AbstractController
{
    public function __construct(
        private readonly CustomerRepository $repository,
        private readonly EntityManagerInterface $em,
    ) {
    }

    #[Route('', name: 'customers_index', methods: ['GET'])]
    public function index(): Response
    {
        return $this->render('customer/index.html.twig', [
            'customers' => $this->repository->findAll(),
        ]);
    }

    #[Route('/new', name: 'customers_new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $customer = new Customer();
        $form = $this->createForm(CustomerType::class, $customer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($customer);
            $this->em->flush();
            $this->addFlash('success', 'Klient został dodany.');

            return $this->redirectToRoute('customers_index');
        }

        return $this->render('customer/new.html.twig', [
            'customer' => $customer,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'customers_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Customer $customer): Response
    {
        return $this->render('customer/show.html.twig', ['customer' => $customer]);
    }

    #[Route('/{id}/edit', name: 'customers_edit', methods: ['GET', 'POST'], requirements: ['id' => '\d+'])]
    public function edit(Request $request, Customer $customer): Response
    {
        $form = $this->createForm(CustomerType::class, $customer);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();
            $this->addFlash('success', 'Klient został zaktualizowany.');

            return $this->redirectToRoute('customers_show', ['id' => $customer->getId()]);
        }

        return $this->render('customer/edit.html.twig', [
            'customer' => $customer,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'customers_delete', methods: ['POST'], requirements: ['id' => '\d+'])]
    public function delete(Request $request, Customer $customer): Response
    {
        if ($this->isCsrfTokenValid('delete'.$customer->getId(), $request->request->get('_token'))) {
            $this->em->remove($customer);
            $this->em->flush();
            $this->addFlash('success', 'Klient został usunięty.');
        }

        return $this->redirectToRoute('customers_index');
    }
}
