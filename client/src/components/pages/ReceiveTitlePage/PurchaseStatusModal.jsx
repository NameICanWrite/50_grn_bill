import { Modal } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import titleApi from "../../../api/title.api"
import styles from './ReceiveTitlePage.module.sass'

export function PurchaseStatusModal({onClose}) {
  const {orderId} = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {

    setLoading(true)
    titleApi.getSingle('spins-order/' + orderId)
    .then(data => {
      setOrder(data)
      console.log(data)
      setLoading(false)
    }).catch(err => {
      // navigate('/receive-random-title')
      console.log(err.message);
    })

  }, [orderId])



  return (
    <div>
      <Modal open={true} onClose={onClose}>
        <div className={styles.purchaseStatusModal}>
          {
            !loading && <div>
              <p>Payment status is "{order?.payment.status}"</p>
              <p>Amount: {order?.payment.amount} UAH</p>
              <p>Your order is {order?.description}</p>
            </div>
          }
        </div>
        
        
      </Modal>
    </div>
    
  )
}