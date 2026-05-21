<?php

namespace App\Controller\Admin;

use App\Entity\Category;
use App\Entity\Customer;
use App\Entity\Product;
use EasyCorp\Bundle\EasyAdminBundle\Config\Dashboard;
use EasyCorp\Bundle\EasyAdminBundle\Config\MenuItem;
use EasyCorp\Bundle\EasyAdminBundle\Controller\AbstractDashboardController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractDashboardController
{
    #[Route('/admin', name: 'admin')]
    public function index(): Response
    {
        return $this->render('admin/dashboard.html.twig');
    }

    public function configureDashboard(): Dashboard
    {
        return Dashboard::new()
            ->setTitle('PO26 — Panel administracyjny');
    }

    public function configureMenuItems(): iterable
    {
        yield MenuItem::linkToDashboard('Pulpit', 'fa fa-home');
        yield MenuItem::linkToCrud('Produkty', 'fa fa-box', Product::class);
        yield MenuItem::linkToCrud('Kategorie', 'fa fa-tags', Category::class);
        yield MenuItem::linkToCrud('Klienci', 'fa fa-users', Customer::class);
        yield MenuItem::linkToRoute('Strona główna', 'fa fa-arrow-left', 'home');
    }
}
