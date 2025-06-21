# Quiz App Modernisierung: Monorepo & External Content Loading

## Aktueller Stand

### App-Architektur

- **Expo React Native App** mit Domain-driven Design
- **State-Management**: Zustand mit modularen Slices:
  - `Data`: Quiz-Registrierung und Konfiguration
  - `State`: Quiz-Zustände und Fortschritte  
  - `UI`: Navigation, Toast-System, Loading-States
  - `Unlock`: Quiz-Freischaltung basierend auf Fortschritt
  - `Hint`: Punkte-System und Hint-Management
- **Persistierung**: AsyncStorage für Quiz-Fortschritte und User-Punkte
- **Type-System**: Saubere Trennung zwischen:
  - `Quiz`: Reine Inhaltsdaten
  - `QuizConfig`: Konfiguration (Unlock-Bedingungen, Reihenfolge)
  - `QuizState`: Runtime-Zustand mit Status und Fortschritt

### Content-Struktur

- **Hardcodiert** in `src/animals/quizzes.ts`
- Quiz-Definitionen als TypeScript-Arrays
- Bilder als `require()` statements eingebunden
- Drei bestehende Quizzes: Namibia, Emoji Animals, Weird Animals

### Domain-Logic

- **Quiz-Utils**: Antwort-Validierung, Fortschritts-Berechnung, Unlock-System
- **Hint-System**: Verschiedene Hint-Typen mit Punkte-Ökonomie
- **String-Manipulation**: Phonetische Antwort-Vergleiche (Kölner Phonetik)

## Ziel

### Funktionale Ziele

1. **Externe Quiz-Quellen**: Automatisches Laden neuer Quizzes von GitHub (ohne eigenen Server)
2. **Content-Management**: Desktop-Tool zur Quiz-Erstellung und -Verwaltung
3. **Offline-Fähigkeit**: App funktioniert weiterhin ohne Internetverbindung
4. **Automatische Updates**: Silent Background-Check oder App-Start Prüfung auf neue Inhalte

### Technische Ziele  

- **Monorepo**: Shared types und domain logic zwischen Mobile App und Content-Tool
- **Type-Safety**: Konsistente Datenstrukturen across platforms
- **Asset-Handling**: Base64-kodierte Bilder für externe Quizzes
- **GitHub als Backend**: JSON-Dateien mit Manifest-System für Quiz-Distribution

### Content-Workflow

- **Web-basiertes Content-Management**: Browser-Tool für Desktop-Nutzung
- **Hybrid-Ansatz**: CLI für schnelle Operationen, GUI für komplexe Quiz-Erstellung
- **Export-System**: Von Content-Tool zu GitHub Repository
- **Versionierung**: Einfaches Überschreiben, keine komplexe Versionskontrolle

## Detaillierte Umsetzungsschritte

### Phase 1: Monorepo Foundation

#### 1.1 Workspace Setup

- **Root package.json konfigurieren**
  - Yarn Workspaces oder npm workspaces einrichten
  - Scripts für entwicklungs-übergreifende Befehle
  - Shared dependencies management

- **Packages-Struktur anlegen**

  ```
  packages/
  ├── shared/           # Types, domain logic, utilities
  ├── mobile/          # Expo React Native App
  └── web/             # Content-Management Web App
  ```

- **Build-Tools einrichten**
  - TypeScript-Konfiguration für Workspace
  - Shared tsconfig.base.json
  - Linting und Formatting across packages

#### 1.2 Code-Migration

- **Types nach Shared Package verschieben**
  - Alle `/src/quiz/types/` Definitionen
  - Image, Question, Quiz, Hint, Unlock types
  - Platform-agnostische Interfaces beibehalten

- **Domain-Logic extrahieren**
  - `/src/quiz/domain/` komplett nach `packages/shared/domain/`
  - Quiz-Utils (Antwort-Validation, Progression, Statistics)
  - Hint-Utils (Factories, Validation, Generation)
  - String-Manipulation Utilities

- **Mobile-App reorganisieren**
  - Aktueller Code nach `packages/mobile/` verschieben
  - Import-Pfade auf `@quiz-app/shared` umstellen
  - Package-spezifische Dependencies isolieren

#### 1.3 Shared Store Foundation

- **Domain-Logic Slices identifizieren**
  - Reine Business-Logic aus aktuellen Slices extrahieren
  - Platform-spezifische Features (AsyncStorage, Navigation) separieren
  - Shared interfaces für Store-Communication definieren

- **Platform-Adapter Interfaces**

  ```typescript
  interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
  }
  
  interface NavigationAdapter {
    navigate(route: string): void;
    goBack(): void;
  }
  ```

- **Shared Domain Store**
  - Quiz-Registrierung und Validation
  - Domain-Rules für Unlock-System
  - Hint-Generation und Point-Calculation

### Phase 2: Web Content-Manager

#### 2.1 Content-Management Tool

- Web-basierte Anwendung zur Quiz-Erstellung und -Verwaltung
- Nutzung der shared types und domain logic
- Export-Funktionalität für externe Quiz-Distribution

### Phase 3: GitHub Integration

#### 3.1 Content-Distribution Vorbereitung

- **GitHub Repository Setup**
  - Separates Repository für Quiz-Content
  - Branch-Strategie (main für Production, dev für Testing)
  - GitHub Actions für automatische Validation

- **Manifest-System definieren**

  ```json
  {
    "version": "1.0.0",
    "quizzes": [
      {
        "id": "tiere-namibias",
        "version": "1.0.0", 
        "title": "Tiere Namibias",
        "url": "./quizzes/tiere-namibias.json",
        "checksum": "sha256-hash"
      }
    ]
  }
  ```

- **External Quiz Format**
  - JSON-Schema für externe Quizzes
  - Base64-kodierte Bilder
  - Kompatibilität mit bestehenden QuizConfig-Types
  - Validation-Rules für Content-Qualität

#### 3.2 Mobile App External-Loading

- **External Quiz Loader implementieren**
  - Fetch-Logic für GitHub Raw Content
  - Error-Handling und Retry-Mechanismus
  - Progress-Tracking für große Downloads

- **Manifest-Fetching beim App-Start**
  - Background-Check gegen cached Version
  - Network-Status berücksichtigen
  - User-Notification bei verfügbaren Updates

- **Merge-Strategie entwickeln**
  - Lokale Quizzes als Fallback beibehalten
  - Externe Quizzes als zusätzliche Inhalte
  - Conflict-Resolution bei ID-Kollisionen
  - Metadata für Quiz-Herkunft

- **Offline-Fallback Mechanismus**
  - Cached externe Quizzes in AsyncStorage
  - Graceful Degradation bei Netzwerk-Fehlern
  - Status-Indication für User (online/offline content)

### Phase 4: CLI-Tools & Automation

#### 4.1 CLI-Interface

- **Basis CLI-Commands entwickeln**

  ```bash
  quiz create "Neues Quiz"
  quiz add-question --quiz="quiz-id" 
  quiz export --target=github
  quiz publish --environment=production
  ```

- **GitHub-Upload Automation**
  - Automatischer Upload zu Content-Repository
  - Manifest-Update nach successful upload
  - Rollback-Mechanismus bei Fehlern

- **Batch-Processing Tools**
  - Bulk-Import von Bildern mit automatischer Optimierung
  - CSV-Import für Quiz-Daten
  - Validation-Pipeline für Content-Qualität

#### 4.2 Integration & Testing

- **End-to-End Workflow validieren**
  - Content-Creation → Export → GitHub → Mobile Download
  - Performance-Testing mit größeren Quiz-Sets
  - Cross-Platform Compatibility (iOS/Android)

- **CI/CD Pipeline einrichten**
  - Automatische Tests für shared packages
  - Content-Validation bei GitHub-Commits  
  - Automated Release-Process für neue Quiz-Versionen

- **Performance-Optimierung**
  - Bundle-Size Analysis für externe Quizzes
  - Image-Compression für Base64-Assets
  - Lazy-Loading Strategien für große Content-Sets

## Kritische Entscheidungspunkte

- **Nach Phase 1**: Validierung der Shared Store Architektur und Performance-Impact
- **Nach Phase 2**: User Experience Bewertung des Content-Managers
- **Nach Phase 3**: External Loading Performance und Offline-Verhalten testen
- **Nach Phase 4**: Production-Readiness und Skalierbarkeit evaluieren

## Erfolgs-Kriterien

1. **Technisch**: Monorepo funktioniert ohne Performance-Einbußen
2. **Content**: Quiz-Erstellung ist mindestens so effizient wie aktueller manueller Prozess
3. **User Experience**: Externe Quizzes laden transparent ohne UX-Verschlechterung
4. **Wartbarkeit**: Neue Quiz-Formate können einfach hinzugefügt werden
