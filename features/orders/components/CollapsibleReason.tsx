import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CollapsibleReasonProps {
  title: string;
  content: string;
  timestamp?: string | null;
  titleColor?: string;
  backgroundColor?: string;
  borderColor?: string;
}

/**
 * Reusable component for displaying collapsable text content.
 * Follows SOLID principles by being a single-responsibility component for collapsable text.
 */
export function CollapsibleReason({
  title,
  content,
  timestamp,
  titleColor = '#E11D48',
  backgroundColor = '#FFF1F2',
  borderColor = '#FFE4E6',
}: CollapsibleReasonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor, borderColor }]}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
          {timestamp && (
            <Text style={styles.timestamp}>
              {new Date(timestamp).toLocaleString([], {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          style={styles.toggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.toggleText, { color: titleColor }]}>
            {isExpanded ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.content} numberOfLines={isExpanded ? undefined : 2}>
        {content}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timestamp: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  content: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  toggle: {
    paddingLeft: 12,
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
