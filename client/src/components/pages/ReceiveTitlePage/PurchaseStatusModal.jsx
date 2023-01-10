import { Modal } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import titleApi from "../../../api/title.api"
import DivWithSpinner from "../../layout/DivWithSpinner"
import styles from './ReceiveTitlePage.module.sass'

export function PurchaseStatusModal({onClose}) {
  const {orderId} = useParams()
  const [order, setOrder] = useState()
  const [loading, setLoading] = useState(true)

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
            <DivWithSpinner className={styles.modalInner} isLoading={loading} spinnerContainerClassName={styles.spinnerContainer}>
              {
                order && order?.payment.status === 'approved' &&
                [
                  <p className={`${styles.modalHeader} ${styles.success}`}>Оплата успішна</p>,
                  <p> Сплачено {order?.payment.amount} грн</p>,
                  <p>Ви купили {order?.description}</p>,
                ]
              }
              {
                order && order?.payment.status === 'pending' && 
                [
                  <p className={styles.modalHeader}>Оплата в процесі...</p>,
                  <p>Ви сплачуєте {order?.payment.amount} грн</p>,
                  <p>Ви купуєте {order?.description}</p>
                ]
              }
              {
                order && order.payment.status === 'declined' &&
                  <p className={`${styles.modalHeader} ${styles.error}`}>Платіж відхилено!</p>
              }
              
              <button className={`${styles.blackSubmit} ${styles.small}`} onClick={onClose}>Ок</button>
            </DivWithSpinner>
          
        </div>
        
        
      </Modal>
    </div>
    
  )
}