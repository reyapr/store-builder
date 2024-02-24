'use client';
import StoreFormModal from "@/components/StoreModal";
import Layout from "@/components/Layout";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { DeleteAlert } from "@/components/DeleteAlert";
import { useCreateStore } from "@/app/stores/use-create-store";
import { useUpdateStore } from "@/app/stores/use-update-store";
import { useDeleteStore } from "@/app/stores/use-delete-store";
import { useGetStore } from "@/app/stores/use-get-store";

const tdStandardStyle = { border: '1px solid', padding: '5px'}

export default function Store() {
  const supabase = createClient();
  const toast = useToast();
 
  const { stores, fetchStores } = useGetStore(toast);
  const createStoreHook = useCreateStore(toast, fetchStores, supabase);
  const updateStoreHook = useUpdateStore(toast, fetchStores, supabase);
  const deleteStoreHook = useDeleteStore(toast, fetchStores, supabase);

  useEffect(() => {
    fetchStores();
  }, []);
  
  return (
    <Layout>
      <StoreFormModal 
        title="Create new store" 
        isOpen={createStoreHook.isOpen} 
        onClose={createStoreHook.onClose} 
        onSubmit={createStoreHook.submitNewStore} 
      />
      <StoreFormModal 
        title="Update store" 
        isOpen={updateStoreHook.isOpen} 
        onClose={updateStoreHook.handleEditClose} 
        onSubmit={updateStoreHook.submitUpdateStore} 
        data={updateStoreHook.currentEditForm} 
      />
      <DeleteAlert
        isOpen={deleteStoreHook.isOpen}
        onClose={deleteStoreHook.handleDeleteClose}
        onSubmit={deleteStoreHook.submitDeleteStore}
        title="Delete Store"
        id={deleteStoreHook.targetDeleteStoreId}
      />
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
              onClick={createStoreHook.onOpen}  
              style={{backgroundColor: '#6a78a6', color: 'white'}}
            >
              Create Store
            </button>
          </div>
          <div>
            <table>
              <thead>
                <tr>
                  <th style={tdStandardStyle}>ID</th>
                  <th style={tdStandardStyle}>Name</th>
                  <th style={tdStandardStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  stores.sort((a,b) => a.id > b.id ? -1 : 1).map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <td style={tdStandardStyle}>{item.id}</td>
                        <td style={tdStandardStyle}>{item.name}</td>
                        <td style={tdStandardStyle}>
                          <button 
                            onClick={() => updateStoreHook.handleEdit({ id: item.id, name: item.name})} 
                            style={{backgroundColor: '#6a78a6', color: 'white'}}
                          >
                            Edit
                          </button>
                          |
                          <button 
                            onClick={() => deleteStoreHook.handleOpenDeleteModal(item.id)} 
                            style={{backgroundColor: '#6a78a6', color: 'white'}}
                          >
                            Delete
                          </button>
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