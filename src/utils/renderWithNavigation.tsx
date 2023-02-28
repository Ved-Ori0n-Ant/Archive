import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {render} from '@testing-library/react-native';

export function renderWithNavigation(renderComponent: any) {
  return render(<NavigationContainer>{renderComponent}</NavigationContainer>);
}
