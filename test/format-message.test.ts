import { formatMessage } from '../src/utils/format-message';
import { describe, it, expect } from 'vitest';

describe('formatMessage', () => {
  it('should return the original message when no context is provided', () => {
    const message = 'Hello, world!';
    expect(formatMessage(message)).toBe(message);
  });

  it('should replace simple placeholders', () => {
    const message = 'Hello, {name}!';
    const context = { name: 'John' };
    expect(formatMessage(message, context)).toBe('Hello, John!');
  });

  it('should handle multiple placeholders', () => {
    const message = 'Hello, {firstName} {lastName}!';
    const context = { firstName: 'John', lastName: 'Doe' };
    expect(formatMessage(message, context)).toBe('Hello, John Doe!');
  });

  it('should handle nested properties using dot notation', () => {
    const message = 'User {user.name} from {user.address.city}';
    const context = { 
      user: { 
        name: 'Alice', 
        address: { 
          city: 'New York' 
        } 
      } 
    };
    expect(formatMessage(message, context)).toBe('User Alice from New York');
  });

  it('should leave placeholder unchanged if property not found', () => {
    const message = 'Hello, {name}!';
    const context = { username: 'John' };
    expect(formatMessage(message, context)).toBe('Hello, {name}!');
  });

  it('should handle objects in placeholders by stringifying them', () => {
    const message = 'Request details: {request}';
    const context = { 
      request: { 
        method: 'GET', 
        path: '/users', 
        headers: { 
          'Content-Type': 'application/json' 
        } 
      } 
    };
    expect(formatMessage(message, context)).toBe(
      'Request details: {"method":"GET","path":"/users","headers":{"Content-Type":"application/json"}}'
    );
  });

  it('should handle arrays in placeholders', () => {
    const message = 'Items: {items}';
    const context = { items: [1, 2, 3] };
    expect(formatMessage(message, context)).toBe('Items: [1,2,3]');
  });

  it('should handle number values', () => {
    const message = 'Count: {count}';
    const context = { count: 42 };
    expect(formatMessage(message, context)).toBe('Count: 42');
  });

  it('should handle boolean values', () => {
    const message = 'Feature enabled: {isEnabled}';
    const context = { isEnabled: true };
    expect(formatMessage(message, context)).toBe('Feature enabled: true');
  });

  it('should handle null values', () => {
    const message = 'Value: {value}';
    const context = { value: null };
    expect(formatMessage(message, context)).toBe('Value: null');
  });

  it('should handle undefined values by leaving placeholder unchanged', () => {
    const message = 'Value: {value}';
    const context = { value: undefined };
    expect(formatMessage(message, context)).toBe('Value: {value}');
  });

  it('should handle circular references gracefully', () => {
    const message = 'Object: {obj}';
    const obj: Record<string, any> = { name: 'Circular' };
    obj.self = obj;
    const context = { obj };
    
    // We expect this not to crash, but the exact output may vary
    // depending on the JSON.stringify implementation
    expect(() => formatMessage(message, context)).not.toThrow();
  });
});