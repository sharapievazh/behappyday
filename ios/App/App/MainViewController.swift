import AVFoundation
import Capacitor

/// Хостовый контроллер приложения. Capacitor 8 (SPM) не всегда автоматически
/// находит локальные (не-npm) нативные плагины через рантайм-сканирование —
/// поэтому регистрируем BeHappyPurchases явно здесь, до загрузки веб-контента.
class MainViewController: CAPBridgeViewController {
    override func capacitorDidLoad() {
        // Звуки (колокольчик, медитации) должны играть и при беззвучном режиме
        try? AVAudioSession.sharedInstance().setCategory(.playback, mode: .default, options: [.mixWithOthers])
        try? AVAudioSession.sharedInstance().setActive(true)
        bridge?.registerPluginInstance(BeHappyPurchases())
    }
}
