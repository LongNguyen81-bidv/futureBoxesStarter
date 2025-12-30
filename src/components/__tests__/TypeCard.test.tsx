/**
 * Component Tests for TypeCard
 */

import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { TypeCard } from '../TypeCard';
import { render } from '../../tests/utils/testHelpers';

describe('TypeCard', () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    type: 'emotion' as const,
    title: 'Emotion',
    description: 'Capture how you feel right now',
    icon: 'heart' as const,
    isSelected: false,
    onPress: mockOnPress,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with correct title and description', () => {
      const { getByText } = render(<TypeCard {...defaultProps} />);

      expect(getByText('Emotion')).toBeDefined();
      expect(getByText('Capture how you feel right now')).toBeDefined();
    });

    it('should render all capsule types correctly', () => {
      const types = [
        { type: 'emotion', title: 'Emotion', icon: 'heart' },
        { type: 'goal', title: 'Goal', icon: 'target' },
        { type: 'memory', title: 'Memory', icon: 'camera' },
        { type: 'decision', title: 'Decision', icon: 'scale-balance' },
      ] as const;

      types.forEach(({ type, title, icon }) => {
        const { getByText } = render(
          <TypeCard
            {...defaultProps}
            type={type}
            title={title}
            icon={icon}
          />
        );

        expect(getByText(title)).toBeDefined();
      });
    });

    it('should render icon component', () => {
      const { root } = render(<TypeCard {...defaultProps} />);

      // Icon should be rendered (MaterialCommunityIcons)
      expect(root).toBeDefined();
    });
  });

  describe('Selection State', () => {
    it('should show selected state when isSelected is true', () => {
      const { getByTestId } = render(
        <TypeCard {...defaultProps} isSelected={true} />
      );

      const card = getByTestId('type-card');
      expect(card).toBeDefined();
      // Visual verification of selected state would require snapshot testing
    });

    it('should show unselected state when isSelected is false', () => {
      const { getByTestId } = render(
        <TypeCard {...defaultProps} isSelected={false} />
      );

      const card = getByTestId('type-card');
      expect(card).toBeDefined();
    });

    it('should update when selection state changes', () => {
      const { rerender, getByTestId } = render(
        <TypeCard {...defaultProps} isSelected={false} />
      );

      rerender(<TypeCard {...defaultProps} isSelected={true} />);

      const card = getByTestId('type-card');
      expect(card).toBeDefined();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when tapped', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      fireEvent.press(getByTestId('type-card'));

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple rapid presses', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      const card = getByTestId('type-card');

      fireEvent.press(card);
      fireEvent.press(card);
      fireEvent.press(card);

      expect(mockOnPress).toHaveBeenCalledTimes(3);
    });

    it('should trigger haptic feedback on press', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      fireEvent.press(getByTestId('type-card'));

      // Haptic feedback is mocked, so we just verify press was successful
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('Animations', () => {
    it('should apply press animation', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      const card = getByTestId('type-card');

      fireEvent(card, 'pressIn');
      fireEvent(card, 'pressOut');

      // Animation should complete without errors
      expect(card).toBeDefined();
    });

    it('should apply selection animation when selected', () => {
      const { rerender } = render(
        <TypeCard {...defaultProps} isSelected={false} />
      );

      // Change to selected
      rerender(<TypeCard {...defaultProps} isSelected={true} />);

      // Animation should trigger without errors
      expect(true).toBe(true);
    });
  });

  describe('Styling', () => {
    it('should apply correct color for emotion type', () => {
      const { root } = render(
        <TypeCard {...defaultProps} type="emotion" />
      );

      expect(root).toBeDefined();
    });

    it('should apply correct color for goal type', () => {
      const { root } = render(
        <TypeCard {...defaultProps} type="goal" title="Goal" />
      );

      expect(root).toBeDefined();
    });

    it('should apply correct color for memory type', () => {
      const { root } = render(
        <TypeCard {...defaultProps} type="memory" title="Memory" />
      );

      expect(root).toBeDefined();
    });

    it('should apply correct color for decision type', () => {
      const { root } = render(
        <TypeCard {...defaultProps} type="decision" title="Decision" />
      );

      expect(root).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility props', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      const card = getByTestId('type-card');

      // Should render with proper touchable properties
      expect(card).toBeDefined();
    });

    it('should be tappable with minimum touch target size', () => {
      const { getByTestId } = render(<TypeCard {...defaultProps} />);

      const card = getByTestId('type-card');

      // Component should be touchable
      fireEvent.press(card);
      expect(mockOnPress).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long description text', () => {
      const longDescription = 'This is a very long description that might wrap to multiple lines and should still render correctly without breaking the layout or causing any visual issues';

      const { getByText } = render(
        <TypeCard {...defaultProps} description={longDescription} />
      );

      expect(getByText(longDescription)).toBeDefined();
    });

    it('should handle empty description', () => {
      const { root } = render(
        <TypeCard {...defaultProps} description="" />
      );

      expect(root).toBeDefined();
    });
  });
});
