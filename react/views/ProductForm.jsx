import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../src/axios.client";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function ProductForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [product, setProduct] = useState({
    id: null,
    product_name: '',
    price:''

  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()
 // console.log(id);
  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/products/${id}`)
        .then(({data}) => {
          setLoading(false)
          setProduct(data)
         // console.log(data);
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])

    
  }

  const onSubmit = ev => {
    console.log(product);
    ev.preventDefault()
    if (product.id) {
      axiosClient.put(`/products/${product.id}`, product)
      
        .then(() => {
          setNotification('product was successfully updated')
          navigate('/products')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/products', product)
        .then(() => {
          setNotification('User was successfully created')
          navigate('/products')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {product.id && <h1>Update Product: {product.product_name}</h1>}
      {!product.id && <h1>New Product</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input value={product.product_name} onChange={ev => setProduct({...product, product_name: ev.target.value})} placeholder="Product Name"/>
            <input value={product.price} onChange={ev => setProduct({...product, price : ev.target.value})} placeholder="Price"/>
           
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}