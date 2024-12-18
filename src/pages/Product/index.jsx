import React from 'react'
import ProductTable from './ProductTable'
import { useTitle } from '../../components/Title'

export default function Product() {
  useTitle("Product");
  return (
    <div>
      <ProductTable />
    </div>
  )
}
