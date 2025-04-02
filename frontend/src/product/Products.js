import React, { useState, useEffect } from 'react';
import { Container, Button, Form} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BottomBar from '../component/BottomBar';
import HeaderBar from '../component/HeaderBar';
import '../App.css';

const dummyProducts = [
    {
      id: 1,
      name: 'iPhone 14',
      description: 'Latest Apple phone.',
      category: 'electronic',
      price: 1099,
      stock: 20,
      image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
      date: '2024-01-10'
    },
    {
      id: 2,
      name: 'Toothpaste',
      description: 'Minty fresh.',
      category: 'daily',
      price: 3.99,
      stock: 50,
      image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
      date: '2025-01-01'
    },
    {
        id: 3,
        name: 'iPhone 14',
        description: 'Latest Apple phone.',
        category: 'electronic',
        price: 1099,
        stock: 20,
        image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
        date: '2024-01-10'
      },
      {
        id: 4,
        name: 'Toothpaste',
        description: 'Minty fresh.',
        category: 'daily',
        price: 3.99,
        stock: 50,
        image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
        date: '2025-01-01'
      },
      {
        id: 5,
        name: 'iPhone 14',
        description: 'Latest Apple phone.',
        category: 'electronic',
        price: 1099,
        stock: 20,
        image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
        date: '2024-01-10'
      },
      {
        id: 6,
        name: 'Toothpaste',
        description: 'Minty fresh.',
        category: 'daily',
        price: 3.99,
        stock: 50,
        image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
        date: '2025-01-01'
      },
      {
          id: 7,
          name: 'iPhone 14',
          description: 'Latest Apple phone.',
          category: 'electronic',
          price: 1099,
          stock: 20,
          image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
          date: '2024-01-10'
       },
       {
          id: 8,
          name: 'Toothpaste',
          description: 'Minty fresh.',
          category: 'daily',
          price: 3.99,
          stock: 50,
          image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
          date: '2025-01-01'
       },
       {
            id: 9,
            name: 'iPhone 14',
            description: 'Latest Apple phone.',
            category: 'electronic',
            price: 1099,
            stock: 20,
            image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
            date: '2024-01-10'
        },
        {
            id: 10,
            name: 'Toothpaste',
            description: 'Minty fresh.',
            category: 'daily',
            price: 3.99,
            stock: 50,
            image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
            date: '2025-01-01'
          },
          {
              id: 11,
              name: 'iPhone 14',
              description: 'Latest Apple phone.',
              category: 'electronic',
              price: 1099,
              stock: 20,
              image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
              date: '2024-01-10'
            },
            {
              id: 12,
              name: 'Toothpaste',
              description: 'Minty fresh.',
              category: 'daily',
              price: 3.99,
              stock: 50,
              image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
              date: '2025-01-01'
            },
            {
              id: 13,
              name: 'iPhone 14',
              description: 'Latest Apple phone.',
              category: 'electronic',
              price: 1099,
              stock: 20,
              image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
              date: '2024-01-10'
            },
            {
              id: 14,
              name: 'Toothpaste',
              description: 'Minty fresh.',
              category: 'daily',
              price: 3.99,
              stock: 50,
              image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
              date: '2025-01-01'
            },
            {
                id: 15,
                name: 'iPhone 14',
                description: 'Latest Apple phone.',
                category: 'electronic',
                price: 1099,
                stock: 20,
                image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
                date: '2024-01-10'
              },
              {
                id: 16,
                name: 'Toothpaste',
                description: 'Minty fresh.',
                category: 'daily',
                price: 3.99,
                stock: 50,
                image: 'https://static1.anpoimages.com/wordpress/wp-content/uploads/wm/2024/10/apple-iphone-16-review-android-police-30.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
                date: '2025-01-01'
              },
  ];

  function Products(){
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('date');
    const productsPerPage = 8;

    useEffect(() => {
        setProducts(dummyProducts);
      }, []);
    
      const getSortedProducts = () => {
        let sorted = [...products];
        if (sortOption === 'date') {
          sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortOption === 'priceLow') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'priceHigh') {
          sorted.sort((a, b) => b.price - a.price);
        }
        return sorted;
      };
    
      const sortedProducts = getSortedProducts();
    
      const paginated = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
      );
    
      const totalPages = Math.ceil(products.length / productsPerPage);

    return (
        <>
          <HeaderBar />
          <Container fluid className="products-page-container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="m-0">Products</h4>
            <Form.Select
                className="w-auto"
                style={{ minWidth: '200px' }}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}>
                <option value="date">Sorted by date</option>
                <option value="priceLow">Sorted by price - Low to High</option>
                <option value="priceHigh">Sorted by price - High to Low</option>
            </Form.Select>
            </div>

            <div className="product-grid">
              {paginated.map((product) => (
                <div className="product-container" key={product.id}>
                  <img src={product.image} alt={product.name} className="product-image" 
                  style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}/>

                  <div className="product-name">{product.name}</div>
                  <div className="product-price">${product.price}</div>
                  <div className="product-buttons">
                    <Button size="sm" variant="success">Add</Button>
                    <Button size="sm" variant="warning" onClick={() => navigate(`/product/${product.id}/edit`)}>Edit</Button>
                  </div>
                </div>))}
            </div>
    
            {/* Pagination */}
            <div className="d-flex justify-content-end mt-4 pe-3">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <Button
                  key={idx}
                  variant={currentPage === idx + 1 ? 'primary' : 'outline-primary'}
                  size="sm"
                  className="me-2"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
            </div>
          </Container>
          <BottomBar />
        </>
      );
}

export default Products;

