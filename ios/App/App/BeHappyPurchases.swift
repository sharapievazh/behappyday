import Foundation
import Capacitor
import StoreKit

@objc(BeHappyPurchases)
public class BeHappyPurchases: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "BeHappyPurchases"
    public let jsName = "BeHappyPurchases"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "getOfferings", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restorePurchases", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "getEntitlementStatus", returnType: CAPPluginReturnPromise)
    ]

    static let productIDs = ["com.behappyday.app.monthly", "com.behappyday.app.annual"]

    @objc func getOfferings(_ call: CAPPluginCall) {
        Task {
            do {
                let products = try await Product.products(for: Self.productIDs)
                let result = products.map { product -> [String: Any] in
                    [
                        "id": product.id,
                        "displayName": product.displayName,
                        "displayPrice": product.displayPrice,
                        "price": NSDecimalNumber(decimal: product.price).doubleValue,
                        "period": Self.periodString(product)
                    ]
                }
                call.resolve(["products": result])
            } catch {
                call.reject("Не удалось загрузить предложения подписки", nil, error)
            }
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        guard let productId = call.getString("productId") else {
            call.reject("productId is required")
            return
        }
        Task {
            do {
                let products = try await Product.products(for: [productId])
                guard let product = products.first else {
                    call.reject("Товар не найден")
                    return
                }
                let result = try await product.purchase()
                switch result {
                case .success(let verification):
                    switch verification {
                    case .verified(let transaction):
                        await transaction.finish()
                        let active = await Self.hasActiveEntitlement()
                        call.resolve(["active": active])
                    case .unverified:
                        call.reject("Не удалось подтвердить покупку")
                    }
                case .userCancelled:
                    call.resolve(["active": false, "cancelled": true])
                case .pending:
                    call.resolve(["active": false, "pending": true])
                @unknown default:
                    call.resolve(["active": false])
                }
            } catch {
                call.reject("Ошибка при оформлении подписки", nil, error)
            }
        }
    }

    @objc func restorePurchases(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                let active = await Self.hasActiveEntitlement()
                call.resolve(["active": active])
            } catch {
                call.reject("Не удалось восстановить покупки", nil, error)
            }
        }
    }

    @objc func getEntitlementStatus(_ call: CAPPluginCall) {
        Task {
            let active = await Self.hasActiveEntitlement()
            call.resolve(["active": active])
        }
    }

    static func hasActiveEntitlement() async -> Bool {
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else { continue }
            if productIDs.contains(transaction.productID) && transaction.revocationDate == nil {
                return true
            }
        }
        return false
    }

    static func periodString(_ product: Product) -> String {
        guard let period = product.subscription?.subscriptionPeriod else { return "" }
        switch period.unit {
        case .day: return "day"
        case .week: return "week"
        case .month: return "month"
        case .year: return "year"
        @unknown default: return ""
        }
    }
}
