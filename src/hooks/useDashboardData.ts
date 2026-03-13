import { useState, useEffect } from 'react'
import Papa from 'papaparse'
import { useTenant } from '../context/TenantContext'

// Generic structure for any department data
export interface DashboardData {
  [key: string]: string
}

const CROP_DATA_URL = 'https://raw.githubusercontent.com/AbhishekKandoi/Crop-Yield-Prediction-based-on-Indian-Agriculture/main/Crop%20Prediction%20dataset.csv'

// Global cache to persist across component re-mounts
let agricultureCache: DashboardData[] | null = null

export function useDashboardData() {
  const { department } = useTenant()
  const [data, setData] = useState<DashboardData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // This function loads the data depending on which department is selected
  const fetchData = () => {
    setIsLoading(true)
    setError(null)

    if (department === 'Agriculture') {
      // Check cache first
      if (agricultureCache) {
        console.log('Serving Agriculture data from cache')
        setData(agricultureCache)
        setIsLoading(false)
        return
      }

      console.log('Fetching Agriculture data from:', CROP_DATA_URL)
      Papa.parse(CROP_DATA_URL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Agriculture data loaded:', results.data.length, 'rows')
          const mapped = results.data
            .filter((row: any) => row.State_Name)
            .map((row: any) => ({
              'State': row.State_Name,
              'District': row.District_Name,
              'Category': row.Crop,
              'Year': row.Crop_Year,
              'Value': row.Production,
              'Metric': 'Tonnes'
            }))
          
          agricultureCache = mapped // Save to cache
          setData(mapped)
          setIsLoading(false)
        },
        error: (err) => {
          console.error('Error loading Agriculture data:', err)
          const fallbackData = [
            { State: 'Maharashtra', District: 'Jalgaon', Category: 'Cotton', Year: '2023', Value: '4500', Metric: 'Tonnes' },
            { State: 'Punjab', District: 'Ludhiana', Category: 'Wheat', Year: '2023', Value: '8200', Metric: 'Tonnes' },
            { State: 'Karnataka', District: 'Hassan', Category: 'Rice', Year: '2023', Value: '3100', Metric: 'Tonnes' },
          ]
          setData(fallbackData)
          setIsLoading(false)
          setError('Failed to fetch live data. Showing fallback data.')
        }
      })
    } else {
      // Mock data for other departments
      setTimeout(() => {
        let mockData: DashboardData[] = []
        
        if (department === 'Health') {
          mockData = [
            { State: 'Maharashtra', District: 'Mumbai', Facility: 'City Hospital', Category: 'Cardiology', Year: '2020', Value: '65', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Mumbai', Facility: 'City Hospital', Category: 'Cardiology', Year: '2021', Value: '88', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Mumbai', Facility: 'City Hospital', Category: 'Cardiology', Year: '2022', Value: '75', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Mumbai', Facility: 'City Hospital', Category: 'Cardiology', Year: '2023', Value: '85', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Pune', Facility: 'Pune General', Category: 'Cardiology', Year: '2020', Value: '55', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Pune', Facility: 'Pune General', Category: 'Cardiology', Year: '2021', Value: '92', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Pune', Facility: 'Pune General', Category: 'Cardiology', Year: '2022', Value: '68', Metric: 'Beds Occupied' },
            { State: 'Maharashtra', District: 'Pune', Facility: 'Pune General', Category: 'Cardiology', Year: '2023', Value: '72', Metric: 'Beds Occupied' },
            { State: 'Punjab', District: 'Amritsar', Facility: 'General Clinic', Category: 'Pediatrics', Year: '2022', Value: '38', Metric: 'Beds Occupied' },
            { State: 'Punjab', District: 'Amritsar', Facility: 'General Clinic', Category: 'Pediatrics', Year: '2023', Value: '42', Metric: 'Beds Occupied' },
            { State: 'Kerala', District: 'Wayanad', Facility: 'State Medical', Category: 'Oncology', Year: '2022', Value: '85', Metric: 'Beds Occupied' },
            { State: 'Kerala', District: 'Wayanad', Facility: 'State Medical', Category: 'Oncology', Year: '2023', Value: '91', Metric: 'Beds Occupied' },
          ]
        } else if (department === 'Education') {
          mockData = [
            { State: 'Delhi', District: 'Central Delhi', Institution: 'Public School', Category: 'Primary', Year: '2023', Value: '94', Metric: 'Literacy Rate %' },
            { State: 'Karnataka', District: 'Bangalore', Institution: 'Tech University', Category: 'Higher Ed', Year: '2023', Value: '88', Metric: 'Literacy Rate %' },
            { State: 'Gujarat', District: 'Ahmedabad', Institution: 'Rural Academy', Category: 'Secondary', Year: '2023', Value: '82', Metric: 'Literacy Rate %' },
          ]
        } else if (department === 'Finance') {
          mockData = [
            { State: 'Maharashtra', District: 'Mumbai', Sector: 'Banking', Category: 'Investment', Year: '2023', Value: '1240', Metric: 'Cr INR' },
            { State: 'Telangana', District: 'Hyderabad', Sector: 'IT Exports', Category: 'Revenue', Year: '2023', Value: '980', Metric: 'Cr INR' },
            { State: 'Haryana', District: 'Gurgaon', Sector: 'Manufacturing', Category: 'Growth', Year: '2023', Value: '750', Metric: 'Cr INR' },
          ]
        }

        setData(mockData)
        setIsLoading(false)
      }, 800)
    }
  }

  // Reload data when the department changes
  useEffect(() => {
    fetchData()
  }, [department])

  // Function to download the data as CSV
  const downloadCSV = (dataToDownload: DashboardData[]) => {
    const csv = Papa.unparse(dataToDownload)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'data-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return { 
    data, 
    isLoading, 
    error, 
    refresh: fetchData, 
    downloadCSV 
  }
}
