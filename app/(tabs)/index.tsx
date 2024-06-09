import { Image, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { useEffect, useState } from 'react';

interface MeterData {
  meterId: string;
  totalUsage: number;
  meterType: string;
  lastSync: string;
}

interface ResidentData {
  name: string;
  roomNumber: number;
  roomUsage: number;
  bill: number;
  data: MeterData[];
}

interface MeterDetails {
  apartmentName: string;
  year: number;
  month: string;
  usageData: ResidentData[];
}

export default function HomeScreen() {
  const [meterDetails, setMeterDetails] = useState<MeterDetails | null>(null);

  useEffect(() => {
    fetch('https://api.waterusage.in/api/totalUsage?month=6&year=2024')
      .then(response => response.json())
      .then((data: MeterDetails) => setMeterDetails(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const renderItem = ({ item }: { item: ResidentData }) => (
    <View className="bg-black p-4 mb-4 rounded-lg">
      <ThemedText type="subtitle" className=''>{item.name}</ThemedText>
      <ThemedText>Room Number: {item.roomNumber || 'N/A'}</ThemedText>
      <ThemedText>Total Room Usage: {item.roomUsage || 'N/A'}</ThemedText>
      <ThemedText>Bill: {item.bill || 'N/A'}</ThemedText>
      <ThemedText type="subtitle">Data:</ThemedText>
      {item.data.map(meter => (
        <View key={meter.meterId}>
          <ThemedText>Meter ID: {meter.meterId}</ThemedText>
          <ThemedText>Total Usage: {meter.totalUsage || 'N/A'}</ThemedText>
          <ThemedText>Meter Type: {meter.meterType || 'N/A'}</ThemedText>
          <ThemedText>Last Sync: {meter.lastSync || 'N/A'}</ThemedText>
        </View>
      ))}
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          className='h-44 w-72 left-0 bottom-0 absolute'
        />
      }>
      <View className='p-4'>
        <ThemedText type="title" className='mb-4'>Meter Readings <HelloWave /></ThemedText>
        <ThemedText>{`Apartment Name: ${meterDetails?.apartmentName || 'N/A'}`}</ThemedText>
        <ThemedText>{`Year: ${meterDetails?.year || 'N/A'}`}</ThemedText>
        <ThemedText>{`Month: ${meterDetails?.month || 'N/A'}`}</ThemedText>
        {meterDetails?.usageData.map((resident, index) => (
          <View key={index}>
            {renderItem({ item: resident })}
          </View>
        ))}
      </View>
    </ParallaxScrollView>
  );
}