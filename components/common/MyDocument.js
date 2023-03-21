import React from 'react';
import { Page, Text, View, Document, StyleSheet, Tspan } from '@react-pdf/renderer';
import {createTw} from 'react-pdf-tailwind'

const tw = createTw({
  theme: {
    fontFamily: 'Lota',
    // extend: {
    //   colors: {
    //     custom: "#bada55",
    //   },
    // },
  },
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#E4E4E4'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});
// Create Document Component
const MyDocument = ({title}) => (
  <Document>
    <Page size="A4" >
      <View style={tw('space-y-10 px-20 py-5 overflow-x-scroll')}>
        {/* Title */}
        <View style={tw('flex flex-row justify-between items-center')}>
          <Text style={tw('text-md')}>{title}</Text>
        </View>

        {/* Parties */}
        <View style={tw('grid grid-cols-2 gap-5')}>
          {/* Party details */}
          <View style={tw('col-span-1 flex flex-col border-[1px] border-gray-300 rounded p-5 space-y-3 w-1/2')}>
            {/* Company Name */}
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-xs text-gray-300')}>Company Name</Text>
              <Text></Text>
            </View>
            

            {/* Company Address */}

            {/* Company TIN */}

            {/* Reffered to as */}
          </View>

          <View style={tw('flex flex-col border-[1px] border-gray-300 rounded p-5 space-y-3')}>
            {/* Company Name */}
            <View style={tw('flex flex-col')}>
              <Text style={tw('text-xs text-gray-300')}>Company Name</Text>
              <Text></Text>
            </View>
            

            {/* Company Address */}

            {/* Company TIN */}

            {/* Reffered to as */}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument