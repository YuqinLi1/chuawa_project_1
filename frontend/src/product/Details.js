import React from 'react';
import { useParams } from 'react-router-dom';
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
      stock: 0,
      image: 'https://i.guim.co.uk/img/media/ca2f3496f6d43ac109d065521cd3eccbc9e238d3/173_348_5195_3117/master/5195.jpg?width=620&dpr=2&s=none&crop=none',
      date: '2024-01-10'
    }
]

function Details(){
    const { id } = useParams();
    const product = dummyProducts.find((p) => p.id === Number(id));

    return (
        <>
          <HeaderBar />
          <div className="product-details-wrapper">
            <h4 className="product-details-title">Product Details</h4>
    
            <div className="product-details-container">
              {/* Left: Image */}
              <div className="product-details-image">
                <img src={product.image} alt={product.name} />
              </div>
    
              {/* Right: Info */}
              <div className="product-details-info">
                <div className="details-category">{product.category}</div>
    
                <h5 className="details-name">{product.name}</h5>
    
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div className="details-price">${product.price}</div>
                  {product.stock === 0 && (
                    <div className="details-warning">Out of stock</div>
                  )}
                </div>
    
                <p className="details-description">{product.description}</p>
    
                <div className="d-flex gap-3 mt-4">
                  <button className="btn btn-primary">Add to Cart</button>
                  <button className="btn btn-secondary">Edit</button>
                </div>
              </div>
            </div>
          </div>
          <BottomBar />
        </>
      );
    }
    

    export default Details;