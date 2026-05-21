<?php

namespace App\Controller\Api;

use App\Entity\Customer;
use App\Repository\CustomerRepository;
use App\Service\EntitySerializer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/customers')]
class CustomerApiController extends AbstractController
{
    public function __construct(
        private readonly CustomerRepository $repository,
        private readonly EntityManagerInterface $em,
        private readonly EntitySerializer $serializer,
    ) {
    }

    #[Route('', name: 'api_customers_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $data = array_map(
            fn (Customer $c) => $this->serializer->customerToArray($c),
            $this->repository->findAll()
        );

        return $this->json($data);
    }

    #[Route('/{id}', name: 'api_customers_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(int $id): JsonResponse
    {
        $customer = $this->repository->find($id);
        if (!$customer) {
            return $this->json(['error' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json($this->serializer->customerToArray($customer));
    }

    #[Route('', name: 'api_customers_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $customer = $this->fillFromArray(new Customer(), $data);
        $this->em->persist($customer);
        $this->em->flush();

        return $this->json($this->serializer->customerToArray($customer), Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'api_customers_update', methods: ['PUT'])]
    public function update(int $id, Request $request): JsonResponse
    {
        $customer = $this->repository->find($id);
        if (!$customer) {
            return $this->json(['error' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!is_array($data)) {
            return $this->json(['error' => 'Invalid JSON'], Response::HTTP_BAD_REQUEST);
        }

        $this->fillFromArray($customer, $data);
        $this->em->flush();

        return $this->json($this->serializer->customerToArray($customer));
    }

    #[Route('/{id}', name: 'api_customers_delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse
    {
        $customer = $this->repository->find($id);
        if (!$customer) {
            return $this->json(['error' => 'Customer not found'], Response::HTTP_NOT_FOUND);
        }

        $this->em->remove($customer);
        $this->em->flush();

        return $this->json(['message' => 'Customer deleted']);
    }

    private function fillFromArray(Customer $customer, array $data): Customer
    {
        if (isset($data['name'])) {
            $customer->setName((string) $data['name']);
        }
        if (isset($data['email'])) {
            $customer->setEmail((string) $data['email']);
        }
        if (array_key_exists('phone', $data)) {
            $customer->setPhone($data['phone']);
        }
        if (array_key_exists('address', $data)) {
            $customer->setAddress($data['address']);
        }

        return $customer;
    }
}
