const factureModel = require('../model/factureModel')
const moment = require('moment')
const doRequest = require('../functions/doRequest')
const clientModel = require('../model/clientModel')
const { query } = require('../functions/db')
const axios = require('axios');

const startSync = () => {
     var interval = setInterval(() => {
          clearInterval(interval)
              selectAndSend()
          cancelInvoice()
     }, 5000)
}

const cancelInvoice = async (req, res) => {
     const url = 'https://ebms.obr.gov.bi:9443'
     try {
          //FIND ALL CUSTOMERS
          const clients = await clientModel.findAll()
          // console.log(clients)
          for (let i = 0; i < clients.length; i++) {  //begin foreach client

               const client = clients[i]
               const NOM_CONTRIBUABLE = client.NOM_CONTRIBUABLE
               const NIF = client.NIF
               const OBR_USERNAME = client.OBR_USERNAME
               const OBR_PASSWORD = client.OBR_PASSWORD
               const allFactures = await factureModel.cancelinvoice(client.ID_CLIENT);

               if (allFactures.length <= 0) {  // TEST SI IL Y A DES FACTURES A ANNULER
                    console.log("Aucune facture à annuler");
                    //return;
                    startSync()
               }
               //FIN TEST FACTURE A ANNULER

               //DEBUT BOUCLE DES FACTURES A
               const factures = await Promise.all(allFactures.map(async facture => {
                    console.log(facture)
                    if (facture.SIGNATURE) {
                         return {
                              signature: {
                                   invoice_signature: facture.SIGNATURE
                              }
                         }
                    }
               })) //DEBUT BOUCLE DES FACTURES A ENVOYER
               // res.status(201).json({
               //      success: true,
               //      message: "liste des factures",
               //      resultats: factures
               // })

               if (allFactures.length > 0) {
                    const resultats = await axios.post(url + '/ebms_api/login', {
                         username: OBR_USERNAME,
                         password: OBR_PASSWORD
                    })
                    const users_token = "Bearer " + resultats.data.result.token
                    // console.log(users_token)
                    await Promise.all(factures.map(async facture => {
                         console.log(facture.signature.invoice_signature)
                         try {
                              const factureResponse = await axios.post(url + '/ebms_api/cancelInvoice', facture.signature, {
                                   // invoice_signature:facture.signature.invoice_signature,
                                   headers: { Authorization: `${users_token}`}
                              })
                              if(factureResponse.data.success==true){
                                   console.log(factureResponse.data.msg)
                                  const updateFacture = await factureModel.update_annuler(facture.signature.invoice_signature) // update the status
                                  res.status(200).json({
                                   success:true,
                                   message:"Update est faite avec succes",
                                   resultats:updateFacture
                                  })
                              }else{
                                   res.status(500).send("update failled")
                              }
                         } catch (error) {
                              console.log(error)
                              res.status(500).send('server error')
                         }
                    }))
               }else{
                    console.log("Aucune facture")
               }



               //           await Promise.all(factures.map(async facture => {

               //                try {
               //                     //ANNULATION D'UNE FACTURE CHEZ OBR
               //                     const factureResponse = await axios.post(url + '/ebms_api/cancelInvoice', facture.facture, {
               //                          headers: { Authorization: `${users_token}` }
               //                     })
               //                     //console.log('factureResponse')
               //                     //Test pour savoir si la facture existe déjà
               //                     if (factureResponse.data.success) {
               //                          //console.log(`${NOM_CONTRIBUABLE} en cours...`)
               //                          console.log(factureResponse.data.msg)
               //                          //UPDATE STATUS IS ANNULE IN TABLE INVOICE
               //                          await factureModel.update_annuler(facture.facture.invoice_signature) // update the status
               //                          console.log('annulation finie')
               //                          startSync()
               //                     }

               //                } catch (error) {
               //                     // Si la facture existe pas
               //                     if (error.response) {
               //                          console.log(`${NOM_CONTRIBUABLE} en cours...`)
               //                          console.log(error.response.data.msg)
               //                          // console.log('finished')
               //                          startSync()
               //                     } else {
               //                          console.log("une erreur s'est produite en annulation")
               //                          console.log(error)
               //                     }
               //                }

               //           }))

               //      }

               // }) //FIN BOUCLE DES FACTURES A ANNULER

          } //end foreach client


     }
     catch (error) {
          console.log(error)
          reponse.status(500).send("Erreur de serveur")
          startSync()
     }
}

const selectAndSend = async () => {
     //URL SERVEUR PRODUCTION
     //const url = 'https://ebms.obr.gov.bi:8443'

     //URL SERVEUR INCONNU
     //const url = 'http://41.79.226.28:8345'

     //URL SERVEUR TEST 
     const url = 'https://ebms.obr.gov.bi:9443'
     try {
          //console.log('start')

          //FIND ALL CUSTOMERS
          const clients = await clientModel.findAll()
          console.log(clients)

          for (let i = 0; i < clients.length; i++) {

               const client = clients[i]
               const NOM_CONTRIBUABLE = client.NOM_CONTRIBUABLE
               const NIF = client.NIF
               const NUMERO_REGISTRE = client.NUMERO_REGISTRE
               const BOITE_POSTAL = client.BOITE_POSTAL
               const NUMERO_CONTRIBUABLE = client.NUMERO_CONTRIBUABLE
               const COMMUNE_CONTRIBUABLE = client.COMMUNE_CONTRIBUABLE
               const QUARTIER_CONTRIBUABLE = client.QUARTIER_CONTRIBUABLE
               const AVENUE_CONTRIBUABLE = client.AVENUE_CONTRIBUABLE
               const NUMERO_ADDRESS = client.NUMERO_ADDRESS || ""
               const CENTRE_FISCAL_CONTRIBUABLE = client.CENTRE_FISCAL_CONTRIBUABLE
               const SECTEUR_ACTIVITE = client.SECTEUR_ACTIVITE
               const FORME_JURDIQUE = client.FORME_JURDIQUE
               const NIF_CLIENT = ''
               const ADDRESS_CLIENT = ''
               const OBR_USERNAME = client.OBR_USERNAME
               const OBR_PASSWORD = client.OBR_PASSWORD

               const allFactures = await factureModel.findAll(client.ID_CLIENT);

               if (allFactures.length <= 0) {  // TEST SI IL Y A DES FACTURES A ENVOYER
                    console.log(`${NOM_CONTRIBUABLE} Prodoction en Cours...`)
                    console.log("Aucune factures à envoyer");
                    //return;
                    console.log('finished')
                    startSync()
               }



               const factures = await Promise.all(allFactures.map(async facture => { //DEBUT BOUCLE DES FACTURES A ENVOYER
                    const concernFactureDetail = await factureModel.findByNumeroFacture(facture.NUMERO_FATURE)
                    const dateFacture = moment(facture.DATE_VENTE).format('YYYY-MM-DD hh:mm:ss')
                    return {
                         facture: {
                              invoice_number: facture.NUMERO_FATURE,
                              invoice_date: dateFacture,
                              tp_type: "2",
                              tp_name: facture.TYPE_FACTURE,
                              tp_name: NOM_CONTRIBUABLE,
                              tp_TIN: NIF,
                              tp_trade_number: NUMERO_REGISTRE,
                              tp_postal_number: BOITE_POSTAL,
                              tp_phone_number: NUMERO_CONTRIBUABLE,
                              tp_address_commune: COMMUNE_CONTRIBUABLE,
                              tp_address_quartier: QUARTIER_CONTRIBUABLE,
                              tp_address_avenue: AVENUE_CONTRIBUABLE,
                              tp_address_number: NUMERO_ADDRESS,
                              vat_taxpayer: "1", // Assujetti à la TVA Valeur : « 0 » ou « 1 »                 
                              ct_taxpayer: "0", // Assujetti à la taxe de consommation Valeur : « 0 » ou « 1 »  
                              tl_taxpayer: "0", // Assujetti au prélèvement forfaitaire  libératoire Valeur : « 0 » ou « 1 »
                              tp_fiscal_center: CENTRE_FISCAL_CONTRIBUABLE,
                              tp_activity_sector: SECTEUR_ACTIVITE,
                              tp_legal_form: FORME_JURDIQUE,
                              payment_type: "1", // Type de paiement de la facture Valeur : « 1 » en espèce « 2 » banque
                              customer_name: facture.CLIENT_NOM,
                              customer_TIN: facture.NIF_CLIENT,
                              customer_address: ADDRESS_CLIENT,
                              vat_customer_payer: '1',  // Si le client est assujetti à la TVA Valeur : « 0 » ou « 1 »
                              cancelled_invoice_ref: facture.IS_ANNULE == 1 ? facture.CANCELLED_INVOICE_REF : "",
                              invoice_signature: `${NIF}/${OBR_USERNAME}/${moment(dateFacture).format('YYYYMMDDhhmmss')}/${facture.NUMERO_FATURE}`,
                              invoice_signature_date: dateFacture,
                              invoice_items: concernFactureDetail.map(factureDetail => { //DEBUT BOUCLE DES ARTICLES DE LA FACTURE

                                   /*const HTVA = factureDetail.MONTANT_NET
                                    const TVA = factureDetail.MONTANT_TVA
                                    const TVAC = factureDetail.MONTANT_TOTAL*/

                                   const HTVA = factureDetail.PT_NET + factureDetail.TAUX_CONSOMMATION + factureDetail.RAS
                                   const TVA = factureDetail.TVA
                                   const TVAC = factureDetail.PT_TVA
                                   return {
                                        item_designation: factureDetail.DESIGNATION,
                                        item_quantity: factureDetail.QUANTITE,
                                        item_price: factureDetail.PU_NET, // Le prix de l’article
                                        item_ct: factureDetail.TAUX_CONSOMMATION, // Taxe de consommation
                                        item_tl: factureDetail.PFT, // Prélèvement forfaitaire libératoire
                                        item_price_nvat: HTVA, // Prix HTVA net PT_NET
                                        vat: TVA, // TVA
                                        item_price_wvat: TVAC, // Prix TVAC + TVA  
                                        Item_total_amount: TVAC, // Prix de Vente total
                                   }
                              })  //FIN BOUCLE DES ARTICLES DE LA FACTURE
                         },
                         FACTURE_ID: facture.FACTURE_ID

                    }
               }))  //FIN BOUCLE DES FACTURES A ENVOYER
               const reussis = []
               const reussisDetails = []
               const errors = []
               const errorsDetail = []

               // TEST SI IL Y A DES FACTURES A ENVOYER
               if (allFactures.length > 0) {

                    //DEBUT AUTHENTIFICATION
                    const resultats = await axios.post(url + '/ebms_api/login', {
                         username: OBR_USERNAME,
                         password: OBR_PASSWORD
                    })

                    //FIN AUTHENTIFICATION

                    //RECUPERATION DU TOKEN
                    const users_token = "Bearer " + resultats.data.result.token

                    await Promise.all(factures.map(async facture => {
                         // console.log(facture)

                         try {
                              //AJOUT D'UNE FACTURE CHEZ OBR
                              const factureResponse = await axios.post(url + '/ebms_api/addInvoice', facture.facture, {
                                   headers: { Authorization: `${users_token}` }
                              })
                              // console.log('factureResponse')
                              //Test pour savoir si la facture existe déjà
                              const signature = `${NIF}/${OBR_USERNAME}/${moment(facture.facture.invoice_date).format('YYYYMMDDhhmmss')}/${facture.facture.invoice_number}`

                              if (factureResponse.data.success) {
                                   console.log(`${NOM_CONTRIBUABLE} en cours...`)
                                   console.log(factureResponse.data.msg)
                                   console.log(signature)
                                   reussis.push(facture)
                                   //UPDATE STATUS SEND AND SIGNATURE IN TABLE ITEMS
                                   await factureModel.setSended(signature, facture.facture.invoice_number) // update the status
                                   reussisDetails.push(`${facture.facture.invoice_number}: ${factureResponse.msg}`)
                                   console.log('finished')
                                   startSync()
                              }

                         } catch (error) {
                              // Si la facture existe deja 
                              if (error.response) {
                                   console.log(`${NOM_CONTRIBUABLE} en cours...`)
                                   console.log(error.response.data.msg)
                                   if (error.response.data.msg == 'Une facture avec le même numéro existe déjà.') {
                                        await factureModel.updateFactureExist(facture.facture.invoice_number)
                                   }
                                   console.log('finished')
                                   startSync()
                              } else {
                                   console.log("une erreur s'est produite")
                                   console.log(error)
                              }
                         }

                    }))
                    // console.log(reussis[24])
                    // if (reussis.length > 0) {
                    // await factureModel.setSended(reussis[0].NUMERO_FATURE) // update the status
                    // }
               }

          }
          // console.log('finished')
          // startSync()
     } catch (error) {
          console.log(error)
          //           startSync()
     }
}

module.exports = {
     selectAndSend,
     cancelInvoice,
     startSync

}