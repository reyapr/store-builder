'use client';
import Layout from "@/components/Layout";

const mockData = [
  {
    name: 'Store 1',
  },
  {
    name: 'Store 2',
  },
  {
    name: 'Store 3',
  }
];

const tdStandardStyle = { border: '1px solid', padding: '5px'}

export default function Home() {
  return (
    <Layout>
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
            <button  style={{backgroundColor: '#6a78a6', color: 'white'}}>Create Store</button>
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
                  mockData.map((item, index) => {
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