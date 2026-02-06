# Enhanced Worker UI - Visual Examples

## Worker Card Layout

### 🚗 Active & Working Worker Card

```
╔══════════════════════════════════════════════════════════════════════╗
║ [GREEN BORDER - 2px] [GREEN BACKGROUND - bg-green-50]                ║
║                                                                       ║
║  Cristia G.                                    [ON DUTY] [ACTIVE TASK]║
║  ID: 9HNJa7K3~O3jWvxEQHmtDi9g                                        ║
║                                                                       ║
║  📞 Phone: +376638713          📦 Total Tasks: 3                     ║
║  👁️ Last Seen: 5m ago          🔋 Battery: 73% [GREEN]              ║
║  📍 Location: 📍 42.5718, 1.6117 [Link to Google Maps]              ║
║                                                                       ║
║  ┌─────────────────────────────┐                                     ║
║  │ 🚙 Vehicle                  │                                     ║
║  │ CAR                         │                                     ║
║  │ D3F4ULT                     │                                     ║
║  │                             │                                     ║
║  │ 📱 Device                   │                                     ║
║  │ ANDROID                     │                                     ║
║  │ Xiaomi 2209116AG            │                                     ║
║  └─────────────────────────────┘                                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

### ⏸️ On Duty - Available Worker Card

```
╔══════════════════════════════════════════════════════════════════════╗
║ [YELLOW BORDER - 2px] [YELLOW BACKGROUND - bg-yellow-50]             ║
║                                                                       ║
║  John Smith                                           [AVAILABLE]    ║
║  ID: abc123def456                                                    ║
║                                                                       ║
║  📞 Phone: +1234567890          📦 Tasks: 5                          ║
║  👁️ Last Seen: 12m ago         🔋 Battery: 45% [YELLOW]            ║
║  📍 Location: 📍 40.7128, -74.0060 [Link to Google Maps]            ║
║                                                                       ║
║  ┌─────────────────────────────┐                                     ║
║  │ 🚙 Vehicle                  │                                     ║
║  │ BIKE                        │                                     ║
║  │ BIKE-001                    │                                     ║
║  │                             │                                     ║
║  │ 📱 Device                   │                                     ║
║  │ IOS                         │                                     ║
║  └─────────────────────────────┘                                     ║
╚══════════════════════════════════════════════════════════════════════╝
```

### ⏹️ Off Duty Worker Card

```
╔══════════════════════════════════════════════════════════════════════╗
║ [GRAY BORDER] [GRAY BACKGROUND - bg-gray-50]                         ║
║                                                                       ║
║  Jane Doe                                              [OFF DUTY]    ║
║  ID: xyz789                                                          ║
║                                                                       ║
║  📞 +0987654321               👁️ 3h ago                             ║
║                                                                       ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## Full Page Layout Example

```
┌─────────────────────────────────────────────────────────────────────┐
│ Onfleet Active Tasks Manager                                        │
│ Manage teams, workers, and tasks                                    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ Onfleet API Key                                                      │
│ Current API Key: demo-api-key...    [Edit] [Clear]                  │
└─────────────────────────────────────────────────────────────────────┘

┌────────────────────────┐ ┌────────────────────────────────────────┐
│ Teams                  │ │ Workers / Drivers          [🔄 Refresh]│
│                        │ │                                         │
│ [Team data...]         │ │ 🚗 Active & Working (2)                │
│                        │ │ ┌─────────────────────────────────────┐│
└────────────────────────┘ │ │ Cristia G.  [ON DUTY][ACTIVE TASK] ││
                           │ │ 📦 3 tasks  🔋 73%  👁️ 5m ago      ││
                           │ └─────────────────────────────────────┘│
                           │ ┌─────────────────────────────────────┐│
                           │ │ Maria L.    [ON DUTY][ACTIVE TASK]  ││
                           │ │ 📦 2 tasks  🔋 89%  👁️ 2m ago      ││
                           │ └─────────────────────────────────────┘│
                           │                                         │
                           │ ⏸️ On Duty - Available (1)             │
                           │ ┌─────────────────────────────────────┐│
                           │ │ John Smith  [AVAILABLE]             ││
                           │ │ 📦 5 tasks  🔋 45%  👁️ 12m ago     ││
                           │ └─────────────────────────────────────┘│
                           │                                         │
                           │ ⏹️ Off Duty (3)                        │
                           │ ┌─────────────────────────────────────┐│
                           │ │ Jane Doe    [OFF DUTY]              ││
                           │ │ 👁️ 3h ago                          ││
                           │ └─────────────────────────────────────┘│
                           │ [... more workers ...]                 │
                           └─────────────────────────────────────────┘
```

---

## Battery Level Color Coding

```
🔋 95% [███████████] Green   - Fully charged
🔋 73% [████████   ] Green   - Good
🔋 45% [█████      ] Yellow  - Medium
🔋 18% [██         ] Red     - Low (needs charging!)
🔋 N/A              Gray    - Data unavailable
```

---

## Time Formatting Examples

```
Just now        - Less than 1 minute
5m ago          - 5 minutes ago
45m ago         - 45 minutes ago
2h ago          - 2 hours ago
5h ago          - 5 hours ago
1d ago          - 1 day ago
3d ago          - 3 days ago
```

---

## Status Badge Combinations

```
[ON DUTY] [ACTIVE TASK]     - Working on delivery (green)
[AVAILABLE]                  - Ready for tasks (yellow)
[OFF DUTY]                   - Not working (gray)
```

---

## Responsive Layout

### Desktop (>= 1024px)
- 3-column grid for worker cards
- Side-by-side vehicle & device info
- Full location coordinates visible

### Tablet (768px - 1023px)
- 2-column grid for worker cards
- Stacked vehicle & device info
- Abbreviated location

### Mobile (< 768px)
- Single column layout
- Compact card design
- Essential info only

---

## Interactive Elements

1. **Refresh Button** (🔄)
   - Reloads all worker data
   - Blue background, hover effect
   - Top-right of Workers section

2. **Google Maps Link** (📍)
   - Clickable coordinates
   - Opens in new tab
   - Blue underline on hover

3. **Expandable Cards** (Future)
   - Click to see task list
   - Show route details
   - Display history

---

## Data Priority Hierarchy

**Most Important** (Always visible):
1. Name
2. Status badges
3. Task count
4. Last seen

**Important** (Visible for on-duty):
5. Battery level
6. Location
7. Phone number

**Supplementary** (Side card):
8. Vehicle info
9. Device info

**Hidden** (Off-duty workers):
- Battery, location, vehicle, device (not relevant)

---

## Color Palette

```
Active Workers:
- Border: #4ade80 (green-400)
- Background: #f0fdf4 (green-50)
- Badge: #22c55e (green-500)

Available Workers:
- Border: #facc15 (yellow-400)
- Background: #fefce8 (yellow-50)
- Badge: #eab308 (yellow-500)

Off Duty:
- Border: #d1d5db (gray-300)
- Background: #f9fafb (gray-50)
- Badge: #9ca3af (gray-400)

Text:
- Primary: #1f2937 (gray-800)
- Secondary: #4b5563 (gray-600)
- Tertiary: #6b7280 (gray-500)
```

---

## Accessibility Features

- ✅ High contrast colors
- ✅ Icon + text labels
- ✅ Keyboard navigable
- ✅ Screen reader friendly
- ✅ Semantic HTML
- ✅ ARIA labels where needed

---

## Performance Optimizations

- Parallel API calls for worker tasks
- Error handling per worker (one failure doesn't break all)
- Optimistic updates on refresh
- React Query caching (1-minute stale time)
- Lazy loading for large worker lists (future)
