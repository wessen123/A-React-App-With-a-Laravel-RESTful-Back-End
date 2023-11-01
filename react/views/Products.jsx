import React from 'react'

import {useEffect, useState} from "react";
import axiosClient from "../src/axios.client";
import {Link} from "react-router-dom";
import { useStateContext } from "../src/contexts/ContextProvider";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getProducts();
  }, [])

  const onDeleteClick = product => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/products/${product.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getProducts();
      })
  }

  const getProducts = () => {
    setLoading(true)
    axiosClient.get('/products')
      .then(({ data }) => {
        setLoading(false)
        setProducts(data.data)

        console.log(data);
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Users</h1>
        <Link className="btn-add" to="/products/new">Add new</Link>

      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Email</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" class="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {products.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.product_name}</td>
                <td>{u.price}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/products/' + u.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
