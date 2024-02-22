'use client';
import StoreFormModal from "@/components/CreateStoreModal";
import Layout from "@/components/Layout";
import { IStoreDTO } from "@/interfaces/store";
import { createClient } from "@/utils/supabase/client";
import { useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

const tdStandardStyle = { border: '1px solid', padding: '5px'}

export default function Store() {
  const supabase = createClient();
  const newFormModal = useDisclosure();
  
  const [stores, setStores] = useState([] as any[]);
  const toast = useToast();
  
  const fetchStores = async () => {
    try {
      const response = await axios.get('/api/store');
      
      setStores(response.data.stores);
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
    }
  }
  
  const submitNewStore = (name: string) => async () => {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    const request = { name, email: user?.email } as IStoreDTO;
    
    try {
      await axios.post('/api/store', request);
      fetchStores();
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message,
        status: "error",
        duration: 2500,
        isClosable: true,
      })
      
    }
    newFormModal.onClose();
  }
  
  useEffect(() => {
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <StoreFormModal title="Create new store" isOpen={newFormModal.isOpen} onClose={newFormModal.onClose} onSubmit={submitNewStore} />
      
      <div 
        style={{ 
          display: 'flex', 
          flex: 11, 
          justifyContent: 'center', 
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <div>
          <b>Store</b>
        </div>
        <div>
          <div>
            <button 
              onClick={newFormModal.onOpen}  
              style={{backgroundColor: '#6a78a6', color: 'white'}}
            >
              Create Store
            </button>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th style={tdStandardStyle}>Name</th>
                  <th style={tdStandardStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  stores.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td  style={tdStandardStyle}>{item.name}</td>
                        <td  style={tdStandardStyle}>
                          <button style={{backgroundColor: '#6a78a6', color: 'white'}}>Edit</button>
                          |
                          <button style={{backgroundColor: '#6a78a6', color: 'white'}}>Delete</button>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}